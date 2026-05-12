import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendReminderEmail } from "@/lib/email";
import { BUSINESS_TZ } from "@/lib/timezone";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Protect with CRON_SECRET — Vercel sends this automatically for cron jobs
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Get current time in business timezone
  const now = new Date();
  const nowInBusiness = new Date(
    now.toLocaleString("en-US", { timeZone: BUSINESS_TZ })
  );

  // Today and tomorrow in business TZ (to cover edge cases near midnight)
  const todayStr = formatDate(nowInBusiness);
  const tomorrow = new Date(nowInBusiness);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  // Fetch active appointments for today and tomorrow that still need reminders
  const { data: appointments, error } = await supabase
    .from("applications")
    .select("id, name, email, date, time, meeting_link, reminder_2h_sent, reminder_30m_sent, reminder_now_sent")
    .in("status", ["pending", "confirmed"])
    .in("date", [todayStr, tomorrowStr])
    .or("reminder_2h_sent.eq.false,reminder_30m_sent.eq.false,reminder_now_sent.eq.false");

  if (error) {
    console.error("[cron/reminders] Query error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!appointments || appointments.length === 0) {
    return NextResponse.json({ sent: 0, message: "No reminders to send" });
  }

  let sent = 0;

  for (const app of appointments) {
    const [h, m] = app.time.substring(0, 5).split(":").map(Number);
    const appointmentTime = new Date(nowInBusiness);
    const [aY, aM, aD] = app.date.split("-").map(Number);
    appointmentTime.setFullYear(aY, aM - 1, aD);
    appointmentTime.setHours(h, m, 0, 0);

    const diffMs = appointmentTime.getTime() - nowInBusiness.getTime();
    const diffMin = diffMs / (1000 * 60);

    const emailData = {
      name: app.name,
      email: app.email,
      date: app.date,
      time: app.time.substring(0, 5),
      meetingLink: app.meeting_link,
    };

    // 12h reminder: send when 11h30m-12h30m remain (window to avoid missing it)
    if (!app.reminder_2h_sent && diffMin > 690 && diffMin <= 750) {
      await sendReminderEmail(emailData, "12h");
      await supabase.from("applications").update({ reminder_2h_sent: true }).eq("id", app.id);
      sent++;
      console.log(`[cron/reminders] 12h reminder sent to ${app.email}`);
    }

    // 1h reminder: send when 50-70 min remain
    if (!app.reminder_30m_sent && diffMin > 50 && diffMin <= 70) {
      await sendReminderEmail(emailData, "1h");
      await supabase.from("applications").update({ reminder_30m_sent: true }).eq("id", app.id);
      sent++;
      console.log(`[cron/reminders] 1h reminder sent to ${app.email}`);
    }

    // 10m reminder: send when 5-15 min remain
    if (!app.reminder_now_sent && diffMin > 5 && diffMin <= 15) {
      await sendReminderEmail(emailData, "10m");
      await supabase.from("applications").update({ reminder_now_sent: true }).eq("id", app.id);
      sent++;
      console.log(`[cron/reminders] 10m reminder sent to ${app.email}`);
    }
  }

  return NextResponse.json({ sent, checked: appointments.length });
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
