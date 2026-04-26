import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";

const loginLimiter = rateLimit({ interval: 60_000, maxRequests: 5 });

export async function POST(req: NextRequest) {
  // Rate limit: 5 intentos por minuto por IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!loginLimiter.check(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera un momento." },
      { status: 429 }
    );
  }

  if (!process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 500 });
  }

  // Validate Origin header (CSRF protection)
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const { email, password } = await req.json();

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  let valid = false;

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.rpc("verify_admin", {
      p_email: email,
      p_password: password,
    });
    
    if (error) {
      console.error("Supabase RPC error:", error);
    } else {
      valid = data === true;
    }
  } else {
    // Development fallback: env variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Servicio no disponible" }, { status: 500 });
    }

    // Constant-time comparison to prevent timing attacks
    const emailMatch = adminEmail.length === email.length &&
      timingSafeEqual(adminEmail, email);
    const passMatch = adminPassword.length === password.length &&
      timingSafeEqual(adminPassword, password);
    valid = emailMatch && passMatch;
  }

  if (!valid) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  // Create JWT session token
  const token = await createSessionToken();

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}

/** Constant-time string comparison */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
