import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "./seed.js";

const prisma = new PrismaClient();

async function main() {
  const [profiles, projects, posts, resumeEntries] = await Promise.all([
    prisma.userProfile.count(),
    prisma.project.count(),
    prisma.post.count(),
    prisma.siteContent.count({
      where: { key: "resume" }
    })
  ]);

  if (profiles > 0 || projects > 0 || posts > 0 || resumeEntries > 0) {
    console.info("Database already has content. Skipping seed.");
    return;
  }

  await seedDatabase(prisma);
  console.info("Database was empty. Seeded initial content.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
