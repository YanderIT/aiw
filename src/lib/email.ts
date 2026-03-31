import * as nodemailer from "nodemailer";

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMPT_USERNAME,
    pass: process.env.SMPT_PASSWORD,
  },
});

export async function sendEmail(params: SendEmailParams) {
  const user = process.env.SMPT_USERNAME;
  const pass = process.env.SMPT_PASSWORD;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!user || !pass || !from) {
    throw new Error(
      "Email service is not configured. Set SMPT_USERNAME, SMPT_PASSWORD and AUTH_EMAIL_FROM."
    );
  }

  const info = await transporter.sendMail({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  return { id: info.messageId };
}
