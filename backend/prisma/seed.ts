import { PrismaClient } from "@prisma/client";
import { posts, profile, projects } from "../src/data/content.js";
import { resume } from "../src/data/resume.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.userProfile.upsert({
    where: { id: 1 },
    update: profile,
    create: {
      id: 1,
      ...profile
    }
  });

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        ...project,
        tags: JSON.stringify(project.tags),
        metrics: JSON.stringify(project.metrics)
      },
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
      update: {
        ...post,
        tags: JSON.stringify(post.tags)
      },
      create: {
        ...post,
        tags: JSON.stringify(post.tags)
      }
    });
  }

  await prisma.siteContent.upsert({
    where: { key: "resume" },
    update: {
      value: JSON.stringify(resume)
    },
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
