import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || "Kley Studio <noreply@kleystudio.com>";

interface ApplicationData {
  name: string;
  email: string;
  date: string;
  time: string;
}

/** Send confirmation email to the applicant */
export async function sendConfirmationEmail(data: ApplicationData) {
  if (!resend) {
    console.log("[email] Resend no configurado, email omitido:", data.email);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: data.email,
    subject: "Aplicación recibida — Carousels Selling",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 28px; background: #0a0907; color: #f1ece1;">
        <div style="border-bottom: 1px solid rgba(212,176,120,0.14); padding-bottom: 24px; margin-bottom: 32px;">
          <span style="font-size: 12px; letter-spacing: 0.5em; color: #f1ece1;">S T U D I O</span>
          <br/>
          <span style="font-size: 9px; letter-spacing: 0.28em; color: #7a7467;">KLEY / CAROUSELS</span>
        </div>

        <p style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #d4b078; margin-bottom: 16px;">
          Aplicación · Carousels Selling
        </p>

        <h1 style="font-size: 28px; font-weight: 300; color: #f1ece1; margin: 0 0 20px;">
          Hola ${data.name.split(" ")[0]},
        </h1>

        <p style="font-size: 15px; line-height: 1.7; color: #c7c0b2; margin-bottom: 28px;">
          Hemos recibido tu aplicación. Si tu caso encaja, el equipo te contactará en las próximas 24–48h para confirmar la llamada.
        </p>

        <div style="border: 1px solid rgba(212,176,120,0.14); padding: 20px; margin-bottom: 28px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7467;">Fecha</td>
              <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #f1ece1;">${data.date}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(212,176,120,0.14);">
              <td style="padding: 8px 0; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7467;">Hora</td>
              <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #f1ece1;">${data.time} CET</td>
            </tr>
            <tr style="border-top: 1px solid rgba(212,176,120,0.14);">
              <td style="padding: 8px 0; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #7a7467;">Estado</td>
              <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #d4b078;">Pendiente</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #7a7467; line-height: 1.6;">
          Si no solicitaste esta aplicación, puedes ignorar este email.
        </p>

        <div style="border-top: 1px solid rgba(212,176,120,0.14); margin-top: 40px; padding-top: 20px;">
          <span style="font-size: 10px; letter-spacing: 0.1em; color: #55504a;">© 2026 KLEY STUDIO · CAROUSELS SELLING</span>
        </div>
      </div>
    `,
  });
}

/** Notify admin about a new application */
export async function sendAdminNotification(data: ApplicationData & { phone: string }) {
  if (!resend) return;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `Nueva aplicación: ${data.name}`,
    html: `
      <div style="font-family: monospace; padding: 20px; background: #0a0907; color: #f1ece1;">
        <h2 style="color: #d4b078;">Nueva aplicación recibida</h2>
        <table style="border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 6px 16px 6px 0; color: #7a7467;">Nombre</td><td>${data.name}</td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #7a7467;">Email</td><td>${data.email}</td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #7a7467;">Teléfono</td><td>${data.phone}</td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #7a7467;">Fecha</td><td>${data.date}</td></tr>
          <tr><td style="padding: 6px 16px 6px 0; color: #7a7467;">Hora</td><td>${data.time}</td></tr>
        </table>
        <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/checkout" style="color: #d4b078;">Ver en el panel →</a></p>
      </div>
    `,
  });
}
