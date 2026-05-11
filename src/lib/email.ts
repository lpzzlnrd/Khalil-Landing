import nodemailer from "nodemailer";
import ical, { ICalCalendarMethod } from "ical-generator";
import { BUSINESS_TZ, BUSINESS_TZ_LABEL } from "@/lib/timezone";

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
const fromEmail =
  process.env.GMAIL_FROM_EMAIL ||
  process.env.RESEND_FROM_EMAIL ||
  (gmailUser ? `Kley Studio <${gmailUser}>` : "Kley Studio <noreply@kleystudio.com>");

const transporter =
  gmailUser && gmailAppPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      })
    : null;

interface ApplicationData {
  name: string;
  email: string;
  date: string;
  time: string;
  meetingLink?: string;
}

function getMeetLink(data: ApplicationData) {
  return data.meetingLink || "https://meet.google.com/";
}

/** Helper to generate ICS file content */
function generateICS(data: ApplicationData) {
  const [year, month, day] = data.date.split("-").map(Number);
  const [hour, minute] = data.time.split(":").map(Number);

  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 min duration

  const calendar = ical({
    name: "Kley Studio Meeting",
    timezone: BUSINESS_TZ,
  });
  calendar.method(ICalCalendarMethod.REQUEST);

  calendar.createEvent({
    start,
    end,
    timezone: BUSINESS_TZ,
    summary: "Reunión Estratégica — Carousels Selling",
    description: `Hola ${data.name}, aquí tienes el link para nuestra reunión: ${getMeetLink(data)}`,
    location: getMeetLink(data),
    url: getMeetLink(data),
    organizer: {
      name: "Kley Studio",
      email: gmailUser || "noreply@kleystudio.com",
    },
  });

  return calendar.toString();
}

/** Send confirmation email to the applicant */
export async function sendConfirmationEmail(data: ApplicationData) {
  if (!transporter) {
    console.log("[email] Gmail SMTP no configurado, email omitido:", data.email);
    return;
  }

  const icsContent = generateICS(data);

  await transporter.sendMail({
    from: fromEmail,
    to: data.email,
    subject: "Confirmación de Cita — Carousels Selling",
    attachments: [
      {
        filename: "invite.ics",
        content: icsContent,
        contentType: "text/calendar; method=REQUEST; charset=UTF-8",
      },
    ],
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 28px; background: #0a1628; color: #e8f0f8;">
        <div style="border-bottom: 1px solid rgba(0,229,255,0.14); padding-bottom: 24px; margin-bottom: 32px;">
          <span style="font-size: 12px; letter-spacing: 0.5em; color: #e8f0f8;">S T U D I O</span><br/>
          <span style="font-size: 9px; letter-spacing: 0.28em; color: #5a7090;">KLEY / CAROUSELS</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 300; color: #e8f0f8; margin-bottom: 20px;">
          ¡Todo listo, ${data.name.split(" ")[0]}!
        </h1>

        <p style="font-size: 15px; line-height: 1.7; color: #a8b8cc; margin-bottom: 28px;">
          Tu cita ha sido confirmada. Hemos adjuntado una invitación de calendario a este correo para que no se te olvide.
        </p>

        <div style="border: 1px solid rgba(0,229,255,0.14); padding: 24px; margin-bottom: 28px;">
          <p style="margin: 0 0 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #5a7090;">Detalles de la sesión</p>
          <p style="margin: 0; font-size: 16px; color: #00e5ff;">${data.date} a las ${data.time} ${BUSINESS_TZ_LABEL}</p>
          
          <p style="margin: 20px 0 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #5a7090;">Link de la reunión</p>
          <a href="${getMeetLink(data)}" style="color: #e8f0f8; text-decoration: underline; font-size: 14px;">Unirse a Google Meet →</a>
        </div>

        <p style="font-size: 13px; color: #5a7090; line-height: 1.6;">
          Te enviaremos recordatorios 2h y 30 min antes de empezar para asegurar que nada falle.
        </p>

        <div style="border-top: 1px solid rgba(0,229,255,0.14); margin-top: 40px; padding-top: 20px;">
          <span style="font-size: 10px; letter-spacing: 0.1em; color: #3d526e;">© 2026 KLEY STUDIO</span>
        </div>
      </div>
    `,
  });
}

/** Notify admin about a new application */
export async function sendAdminNotification(data: ApplicationData & { phone: string }) {
  if (!transporter) return;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await transporter.sendMail({
    from: fromEmail,
    to: adminEmail,
    subject: `Nueva cita agendada: ${data.name}`,
    html: `
      <div style="font-family: monospace; padding: 20px; background: #0a1628; color: #e8f0f8;">
        <h2 style="color: #00e5ff;">Nueva cita recibida</h2>
        <p><strong>Cliente:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Fecha/Hora:</strong> ${data.date} @ ${data.time}</p>
        <p><strong>Link Meet:</strong> <a href="${getMeetLink(data)}" style="color: #00e5ff;">${getMeetLink(data)}</a></p>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/checkout" style="color: #00e5ff;">Gestionar en el panel →</a>
      </div>
    `,
  });
}

/** Generic Reminder Email */
export async function sendReminderEmail(data: ApplicationData, type: "2h" | "30m" | "now") {
  if (!transporter) return;

  const title = type === "now" ? "¡Empezamos ya!" : `Recordatorio: Faltan ${type}`;
  const message = type === "now" 
    ? "La reunión está empezando ahora mismo. ¡Te esperamos!" 
    : `Tu sesión estratégica comienza en ${type === "2h" ? "2 horas" : "30 minutos"}.`;

  await transporter.sendMail({
    from: fromEmail,
    to: data.email,
    subject: `${title} — Carousels Selling`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 28px; background: #0a1628; color: #e8f0f8; border: 1px solid #00e5ff;">
        <h2 style="color: #00e5ff; font-weight: 300;">${title}</h2>
        <p style="color: #a8b8cc; font-size: 16px;">${message}</p>
        <div style="margin: 30px 0; padding: 20px; border: 1px solid rgba(0,229,255,0.2);">
          <a href="${getMeetLink(data)}" style="display: block; text-align: center; background: #00e5ff; color: #0a1628; padding: 12px; text-decoration: none; font-weight: bold; border-radius: 4px;">
            ENTRAR A LA REUNIÓN
          </a>
        </div>
        <p style="font-size: 12px; color: #5a7090;">Si tienes problemas para entrar, contacta con soporte.</p>
      </div>
    `
  });
}
