import { env } from "../config/env.js";
import { createContactMessage } from "../services/contact.service.js";
import { sendContactNotification } from "../services/email.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const contactController = asyncHandler(async (req, res) => {
  const honeypot =
    typeof req.body?.companyWebsite === "string" ? req.body.companyWebsite.trim() : "";
  const startedAt =
    typeof req.body?.formStartedAt === "number" ? req.body.formStartedAt : Number(req.body?.formStartedAt);
  const elapsedMs = Number.isFinite(startedAt) ? Date.now() - startedAt : null;

  // Silently accept bot-like submissions to reduce form probing signal.
  if (honeypot || (elapsedMs !== null && elapsedMs >= 0 && elapsedMs < env.CONTACT_MIN_FILL_SECONDS * 1000)) {
    sendSuccess(
      res,
      {
        message: "Message received. I will get back to you soon.",
        contactMessageId: 0,
        createdAt: new Date()
      },
      201
    );
    return;
  }

  const message = await createContactMessage(req.body);

  try {
    const notification = await sendContactNotification(message);

    if (notification.status === "skipped") {
      console.info(`Contact email notification skipped: ${notification.reason}`);
    }
  } catch (error) {
    console.error("Contact email notification failed:", error);
  }

  sendSuccess(
    res,
    {
      message: "Message received. I will get back to you soon.",
      contactMessageId: message.id,
      createdAt: message.createdAt
    },
    201
  );
});
