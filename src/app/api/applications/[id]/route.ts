import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_STATUSES = ["pending", "confirmed", "cancelled"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  // esto es un verificador que hice con ia, es para validar los id aunque supabase ya lo hace 
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const { status } = body;

  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (error) {
    console.error("Supabase init error:", error);
    return NextResponse.json({ error: "Servicio de base de datos no disponible" }, { status: 500 });
  }

  const { error } = await supabaseAdmin
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Error al actualizar la aplicación" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id, status });
}
