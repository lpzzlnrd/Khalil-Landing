import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/schemas";
import { isAuthenticated } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

// Rate limit: 10 applications per minute per IP
const applicationLimiter = rateLimit({ interval: 60_000, maxRequests: 10 });

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
    const body = await req.json();
    const parsed = applicationSchema.parse(body);

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

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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
