import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { runStartupSecurityChecks } from "./config/security-checks.js";
import { startContactReminderJob } from "./services/contact-reminder.service.js";

runStartupSecurityChecks();
const app = createApp();
const stopContactReminderJob = startContactReminderJob();

const server = app.listen(env.PORT, () => {
  console.info(`API server listening on http://localhost:${env.PORT}`);
});

const shutdown = async () => {
  stopContactReminderJob();
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
