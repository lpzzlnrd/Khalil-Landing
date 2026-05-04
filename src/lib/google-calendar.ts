import { google } from "googleapis";
import { BUSINESS_TZ } from "@/lib/timezone";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function getAuth() {
  const jsonB64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!jsonB64) return null;

  try {
    const creds = JSON.parse(Buffer.from(jsonB64, "base64").toString("utf-8"));
    return new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });
  } catch {
    console.error("[google-calendar] Failed to parse service account JSON");
    return null;
  }
}

/**
 * Creates a Google Calendar event with an auto-generated Google Meet link.
 * Returns the Meet link or null if the service is not configured.
 */
export async function createMeetEvent(data: {
  name: string;
  email: string;
  date: string; // YYYY-MM-DD in business TZ
  time: string; // HH:MM in business TZ
}): Promise<string | null> {
  const auth = getAuth();
  if (!auth) {
    console.log("[google-calendar] Not configured, skipping Meet creation");
    return null;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const calendar = google.calendar({ version: "v3", auth });

  const startDateTime = `${data.date}T${data.time}:00`;
  const [h, m] = data.time.split(":").map(Number);
  const endMinutes = h * 60 + m + 30; // 30 min duration
  const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
  const endM = String(endMinutes % 60).padStart(2, "0");
  const endDateTime = `${data.date}T${endH}:${endM}:00`;

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Reunión Estratégica — ${data.name}`,
      description: `Sesión estratégica de Carousels Selling con ${data.name} (${data.email})`,
      start: {
        dateTime: startDateTime,
        timeZone: BUSINESS_TZ,
      },
      end: {
        dateTime: endDateTime,
        timeZone: BUSINESS_TZ,
      },
      attendees: [{ email: data.email }],
      conferenceData: {
        createRequest: {
          requestId: `kley-${data.date}-${data.time}-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 120 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  const meetLink = event.data.conferenceData?.entryPoints?.find(
    (ep) => ep.entryPointType === "video"
  )?.uri;

  return meetLink || null;
}
