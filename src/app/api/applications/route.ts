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

    // RULE 1: 24h dead range (at least 24h from now)
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 24);
    const appointmentDate = new Date(`${parsed.date}T${parsed.time}`);
    
    if (appointmentDate < minDate) {
      return NextResponse.json(
        { error: "La cita debe agendarse con al menos 24h de antelación." },
        { status: 400 }
      );
    }

    // RULE 2: Double booking prevention (same date and same time)
    const { data: alreadyBooked, error: checkError } = await supabaseAdmin
      .from("applications")
      .select("id")
      .eq("date", parsed.date)
      .eq("time", parsed.time)
      .in("status", ["pending", "confirmed"])
      .limit(1);

    if (checkError) {
      console.error("Supabase availability check error:", checkError);
      return NextResponse.json({ error: "No se pudo validar la disponibilidad" }, { status: 500 });
    }

    if (alreadyBooked && alreadyBooked.length > 0) {
      return NextResponse.json(
        { error: "Este horario ya ha sido reservado. Elige otro." },
        { status: 409 }
      );
    }

    // Generate a simple Google Meet link (pattern-based)
    const meetingId = Math.random().toString(36).substring(2, 5) + "-" + 
                      Math.random().toString(36).substring(2, 6) + "-" + 
                      Math.random().toString(36).substring(2, 5);
    const meetingLink = `https://meet.google.com/${meetingId}`;

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
          meeting_link: meetingLink,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Error al guardar la aplicación" }, { status: 500 });
    }

    // Enviar correos
    const emailData = {
      name: parsed.name,
      email: parsed.email,
      date: parsed.date,
      time: parsed.time,
      meetingLink: meetingLink,
    };

    try {
      await Promise.all([
        sendConfirmationEmail(emailData),
        sendAdminNotification({ ...emailData, phone: parsed.phone }),
      ]);
    } catch (e) {
      console.error("Error enviando emails:", e);
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
      return NextResponse.json({ error: "Servicio no disponible" }, { status: 500 });
    }

    const date = req.nextUrl.searchParams.get("date");
    const month = req.nextUrl.searchParams.get("month");

    if (date) {
      const { data, error } = await supabaseAdmin
        .from("applications")
        .select("time")
        .eq("date", date)
        .in("status", ["pending", "confirmed"]);

      if (error) return NextResponse.json({ error: "Error" }, { status: 500 });
      return NextResponse.json({ bookedTimes: (data || []).map((r: any) => r.time.substring(0, 5)) });
    }

    if (month) {
      const start = `${month}-01`;
      const [y, m] = month.split("-");
      const end = `${y}-${m}-${new Date(Number(y), Number(m), 0).getDate()}`;

      const { data, error } = await supabaseAdmin
        .from("applications")
        .select("date, time")
        .gte("date", start)
        .lte("date", end)
        .in("status", ["pending", "confirmed"]);

      if (error) return NextResponse.json({ error: "Error" }, { status: 500 });
      return NextResponse.json({ appointments: data });
    }

    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (error) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 500 });
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
