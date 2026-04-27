import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/schemas";
import { isAuthenticated } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

// Rate limit: 10 applications per minute per IP
const applicationLimiter = rateLimit({ interval: 60_000, maxRequests: 10 });
// Rate limit for public availability checks
const availabilityLimiter = rateLimit({ interval: 60_000, maxRequests: 60 });

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!applicationLimiter.check(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta más tarde." },
      { status: 429 }
    );
  }

  // CSRF: validate origin
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const parsed = applicationSchema.parse(body);

    // Rule: one active appointment per day
    const { data: bookedSameDay, error: dayCheckError } = await supabaseAdmin
      .from("applications")
      .select("id")
      .eq("date", parsed.date)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (dayCheckError) {
      console.error("Supabase availability check error:", dayCheckError);
      return NextResponse.json({ error: "No se pudo validar la disponibilidad" }, { status: 500 });
    }

    if (bookedSameDay && bookedSameDay.length > 0) {
      return NextResponse.json(
        { error: "Este día ya no está disponible. Elige otra fecha." },
        { status: 409 }
      );
    }

    // Guardar en Supabase
    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert([
        {
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          date: parsed.date,
          time: parsed.time,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Error al guardar la aplicación" }, { status: 500 });
    }

    // Enviar correos en segundo plano (no bloquean la respuesta)
    const emailData = {
      name: parsed.name,
      email: parsed.email,
      date: parsed.date,
      time: parsed.time,
    };

    try {
      await Promise.all([
        sendConfirmationEmail(emailData),
        sendAdminNotification({ ...emailData, phone: parsed.phone }),
      ]);
    } catch (e) {
      console.error("Error enviando emails:", e);
      // No fallamos la petición si solo fallan los emails
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    console.error("Server error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const availabilityMode = req.nextUrl.searchParams.get("availability");
  if (availabilityMode === "1") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!availabilityLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }

    let supabaseAdmin;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch (error) {
      console.error("Supabase init error:", error);
      return NextResponse.json({ error: "Servicio de base de datos no disponible" }, { status: 500 });
    }

    const month = req.nextUrl.searchParams.get("month") || "";
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Parámetro month inválido (YYYY-MM)" }, { status: 400 });
    }

    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    const start = `${yearStr}-${monthStr}-01`;
    const endDate = new Date(year, monthIndex + 1, 0);
    const end = `${yearStr}-${monthStr}-${String(endDate.getDate()).padStart(2, "0")}`;

    const { data, error } = await supabaseAdmin
      .from("applications")
      .select("date")
      .gte("date", start)
      .lte("date", end)
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Supabase availability error:", error);
      return NextResponse.json({ error: "Error al obtener disponibilidad" }, { status: 500 });
    }

    const bookedDates = Array.from(new Set((data || []).map((row) => row.date)));
    return NextResponse.json({ bookedDates });
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (error) {
    console.error("Supabase init error:", error);
    return NextResponse.json({ error: "Servicio de base de datos no disponible" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Error al obtener aplicaciones" }, { status: 500 });
  }

  return NextResponse.json(data);
}
