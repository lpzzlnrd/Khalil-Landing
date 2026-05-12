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

function formatHumanDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return `${day} de ${months[month - 1]} de ${year}`;
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
  const dateLabel = formatHumanDate(data.date);

  await transporter.sendMail({
    from: fromEmail,
    to: data.email,
    subject: "¡Tenemos una llamada juntos!",
    attachments: [
      {
        filename: "invite.ics",
        content: icsContent,
        contentType: "text/calendar; method=REQUEST; charset=UTF-8",
      },
    ],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 28px; background: #0a1628; color: #e8f0f8;">
        <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 700; color: #00e5ff;">¡Tenemos una llamada juntos!</h1>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">Hola <strong>${data.name}</strong>!</p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
          Tu llamada con Kley ha sido agendada con éxito, para el día <strong>${dateLabel}</strong> a las
          <strong>${data.time}</strong> hora <strong>${BUSINESS_TZ_LABEL}</strong>. 😁😁
        </p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
          Kley te contactará por WhatsApp con los detalles de su llamada.
        </p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
          De todas formas aquí te dejamos el link en el cual se van a conectar llegado el día y hora 👉
          <a href="${getMeetLink(data)}" style="color: #00e5ff;">${getMeetLink(data)}</a>
        </p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px; font-weight: 700;">
          Estamos MUY emocionados!
        </p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
          Recuerda por favor ser puntual con la hora y fecha que agendaste ⏱️
        </p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
          Nos vemos muy pronto.
        </p>

        <p style="font-size: 16px; line-height: 1.7; margin: 0;">
          Equipo de Kley Studio
        </p>
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
export async function sendReminderEmail(data: ApplicationData, type: "12h" | "1h" | "10m") {
  if (!transporter) return;

  const meetLink = getMeetLink(data);
  const title =
    type === "12h"
      ? "Nuestra reunión!! 😁"
      : type === "1h"
        ? "Queda solo una hora!! 😮"
        : "Nos vemos en 10 minutos!!!";

  const message =
    type === "12h"
      ? "Nuestra llamada es en 12 horas!!! 😄"
      : type === "1h"
        ? "Nuestra llamada es en 1 hora!!! 😄😄😄"
        : "Nuestra llamada es en 10 minutos";

  const footer =
    type === "12h"
      ? "Equipo de Kley Studio"
      : type === "1h"
        ? "Nos vemos en un rato! 👋"
        : "¡Nos vemos dentro!";

  await transporter.sendMail({
    from: fromEmail,
    to: data.email,
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 28px; background: #0a1628; color: #e8f0f8;">
        <h1 style="margin: 0 0 24px; font-size: 26px; font-weight: 700; color: #00e5ff;">${title}</h1>

        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">Hola ${data.name},</p>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">${message}</p>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
          Recuerda ser puntual con la hora y conectarte desde un sitio tranquilo y con buen internet.
        </p>
        ${
          type === "12h"
            ? `<p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
                Si no se te acomoda la hora o fecha, escríbeme!
              </p>`
            : `<p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">
                Si no te acomoda la hora u otra cosa, escríbeme!
              </p>`
        }
        <div style="margin: 30px 0; padding: 20px; border: 1px solid rgba(0,229,255,0.2);">
          <a href="${meetLink}" style="display: block; text-align: center; background: #00e5ff; color: #0a1628; padding: 12px; text-decoration: none; font-weight: bold; border-radius: 4px;">
            ${type === "10m" ? "INGRESA AL LINK" : "ENTRAR A LA REUNIÓN"}
          </a>
        </div>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 18px;">${footer}</p>
        <p style="font-size: 12px; color: #5a7090; margin: 0;">Equipo de Kley Studio</p>
      </div>
    `,
  });
}
