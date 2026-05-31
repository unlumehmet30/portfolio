import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import {
  isContactEmailConfigured,
  sendContactReminderNotification
} from "./email.service.js";

const minutesToMs = (minutes: number) => minutes * 60 * 1000;
const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;

let reminderSweepRunning = false;

export async function runContactReminderSweep(now = new Date()) {
  if (!isContactEmailConfigured()) {
    return { checked: 0, sent: 0, skipped: true };
  }

  if (reminderSweepRunning) {
    return { checked: 0, sent: 0, skipped: true };
  }

  reminderSweepRunning = true;

  try {
    const reminderWindowMs = daysToMs(env.CONTACT_REMINDER_DAYS);
    const cutoff = new Date(now.getTime() - reminderWindowMs);
    const messages = await prisma.contactMessage.findMany({
      where: {
        archived: false,
        handledAt: null,
        createdAt: {
          lte: cutoff
        },
        OR: [
          { lastReminderAt: null },
          {
            lastReminderAt: {
              lte: cutoff
            }
          }
        ]
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    let sent = 0;

    for (const message of messages) {
      try {
        const notification = await sendContactReminderNotification(message);

        if (notification.status === "sent") {
          await prisma.contactMessage.update({
            where: { id: message.id },
            data: {
              lastReminderAt: now,
              reminderCount: {
                increment: 1
              }
            }
          });
          sent += 1;
        }
      } catch (error) {
        console.error(`Contact reminder failed for message ${message.id}:`, error);
      }
    }

    return { checked: messages.length, sent, skipped: false };
  } finally {
    reminderSweepRunning = false;
  }
}

export function startContactReminderJob() {
  if (!isContactEmailConfigured()) {
    console.info("Contact reminder job disabled: email notification is not fully configured.");
    return () => {};
  }

  const interval = minutesToMs(env.CONTACT_REMINDER_INTERVAL_MINUTES);
  const run = async () => {
    const result = await runContactReminderSweep();

    if (result.checked > 0) {
      console.info(`Contact reminder sweep checked ${result.checked} message(s), sent ${result.sent}.`);
    }
  };

  void run();
  const timer = setInterval(() => {
    void run();
  }, interval);

  return () => clearInterval(timer);
}
