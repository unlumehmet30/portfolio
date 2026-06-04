import { PrismaClient } from "@prisma/client";
import { posts, profile, projects } from "../src/data/content.js";
import { resume } from "../src/data/resume.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.userProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      ...profile
    }
  });

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        ...project,
        tags: JSON.stringify(project.tags),
        metrics: JSON.stringify(project.metrics)
      }
    });
  }

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        tags: JSON.stringify(post.tags)
      }
    });
  }

  await prisma.siteContent.upsert({
    where: { key: "resume" },
    update: {},
    create: {
      key: "resume",
      value: JSON.stringify(resume)
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.info("Database seeded.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
