import { google } from "googleapis";
import { BUSINESS_TZ } from "@/lib/timezone";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

type CalendarAuth = {
  // Use a loose type to avoid build-time complaints from the googleapis type exports.
  auth: any;
  canInviteAttendees: boolean;
};

function getServiceAccountAuth(): CalendarAuth | null {
  const jsonB64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!jsonB64) return null;

  try {
    const creds = JSON.parse(Buffer.from(jsonB64, "base64").toString("utf-8"));
    const auth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });
    return { auth, canInviteAttendees: false };
  } catch {
    console.error("[google-calendar] Failed to parse service account JSON");
    return null;
  }
}

function getOAuth2Auth(): CalendarAuth | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const auth = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  auth.setCredentials({ refresh_token: refreshToken });

  return { auth, canInviteAttendees: true };
}

function getAuth(): CalendarAuth | null {
  const oauth = getOAuth2Auth();
  if (oauth) {
    console.log("[google-calendar] Using OAuth2 Authentication");
    return oauth;
  }

  const service = getServiceAccountAuth();
  if (service) {
    console.log("[google-calendar] Using Service Account Authentication (Warning: Meet links might fail)");
    return service;
  }

  return null;
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
  const authConfig = getAuth();
  if (!authConfig) {
    console.log("[google-calendar] Not configured, skipping Meet creation");
    return null;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const calendar = google.calendar({ version: "v3", auth: authConfig.auth });

  // requestId must be alphanumeric and unique
  const safeDate = data.date.replace(/-/g, "");
  const safeTime = data.time.replace(/:/g, "");
  const requestId = `kley${safeDate}${safeTime}${Date.now()}`.substring(0, 64);

  const startDateTime = `${data.date}T${data.time}:00`;
  const [h, m] = data.time.split(":").map(Number);
  const endMinutes = h * 60 + m + 30; // 30 min duration
  const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
  const endM = String(endMinutes % 60).padStart(2, "0");
  const endDateTime = `${data.date}T${endH}:${endM}:00`;

  const requestBody: any = {
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
    conferenceData: {
      createRequest: {
        requestId,
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
  };

  if (authConfig.canInviteAttendees) {
    requestBody.attendees = [{ email: data.email }];
  }

  try {
    const event = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      requestBody,
    });

    const meetLink = event.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === "video"
    )?.uri;

    return meetLink || null;
  } catch (error: any) {
    console.error("[google-calendar] Failed to create Meet event:", error.message);
    if (error.response?.data) {
      console.error("[google-calendar] API Error Details:", JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}
