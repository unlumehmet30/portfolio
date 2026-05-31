import { Resend } from "resend";
import { env } from "../config/env.js";

type ContactNotification = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
};

type EmailContent = {
  html: string;
  subject: string;
  text: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function isContactEmailConfigured() {
  return Boolean(env.CONTACT_NOTIFICATION_EMAIL && env.RESEND_API_KEY);
}

function buildContactEmail(message: ContactNotification): EmailContent {
  const createdAt = message.createdAt.toISOString();
  const text = [
    "New portfolio contact message",
    "",
    `Message ID: ${message.id}`,
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Subject: ${message.subject}`,
    `Created at: ${createdAt}`,
    "",
    "Message:",
    message.message
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1b1f1c; line-height: 1.55;">
      <h2 style="margin: 0 0 16px; color: #2f7d4e;">New portfolio contact message</h2>
      <p><strong>Message ID:</strong> ${message.id}</p>
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></p>
      <p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>
      <p><strong>Created at:</strong> ${createdAt}</p>
      <hr style="border: 0; border-top: 1px solid #dadfd9; margin: 20px 0;" />
      <p style="white-space: pre-line;">${escapeHtml(message.message)}</p>
    </div>
  `;

  return {
    subject: `New portfolio message: ${message.subject}`,
    text,
    html
  };
}

function buildReminderEmail(message: ContactNotification): EmailContent {
  const createdAt = message.createdAt.toISOString();
  const text = [
    "Reminder: portfolio message still needs attention",
    "",
    `Message ID: ${message.id}`,
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Subject: ${message.subject}`,
    `Created at: ${createdAt}`,
    "",
    "Message:",
    message.message
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1b1f1c; line-height: 1.55;">
      <h2 style="margin: 0 0 16px; color: #2f7d4e;">Reminder: portfolio message still needs attention</h2>
      <p>This message has not been marked as handled for ${env.CONTACT_REMINDER_DAYS} days.</p>
      <p><strong>Message ID:</strong> ${message.id}</p>
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></p>
      <p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>
      <p><strong>Created at:</strong> ${createdAt}</p>
      <hr style="border: 0; border-top: 1px solid #dadfd9; margin: 20px 0;" />
      <p style="white-space: pre-line;">${escapeHtml(message.message)}</p>
    </div>
  `;

  return {
    subject: `Reminder: ${message.subject}`,
    text,
    html
  };
}

async function sendEmail(message: ContactNotification, content: EmailContent) {
  if (!env.CONTACT_NOTIFICATION_EMAIL) {
    return { status: "skipped", reason: "CONTACT_NOTIFICATION_EMAIL is not configured" };
  }

  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    return { status: "skipped", reason: "RESEND_API_KEY is not configured" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: env.CONTACT_EMAIL_FROM,
    to: [env.CONTACT_NOTIFICATION_EMAIL],
    replyTo: message.email,
    subject: content.subject,
    text: content.text,
    html: content.html
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }

  return { status: "sent" };
}

export async function sendContactNotification(message: ContactNotification) {
  return sendEmail(message, buildContactEmail(message));
}

export async function sendContactReminderNotification(message: ContactNotification) {
  return sendEmail(message, buildReminderEmail(message));
}
