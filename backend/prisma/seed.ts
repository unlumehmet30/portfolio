import { PrismaClient } from "@prisma/client";
import { pathToFileURL } from "url";
import { posts, profile, projects } from "../src/data/content.js";
import { resume } from "../src/data/resume.js";

export async function seedDatabase(prisma: PrismaClient) {
  await prisma.userProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      ...profile
    }
  });

  for (const project of projects) {
    const { tags, metrics, galleryImages = [], ...projectData } = project;

    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        ...projectData,
        tags: JSON.stringify(tags),
        metrics: JSON.stringify(metrics),
        projectImages: {
          create: galleryImages.map((image, index) => ({
            url: image.url,
            alt: image.alt ?? null,
            sortOrder: index
          }))
        }
      }
    });
  }

  for (const post of posts) {
    const { tags, files = [], images = [], ...postData } = post;

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...postData,
        tags: JSON.stringify(tags),
        postImages: {
          create: images.map((image, index) => ({
            url: image.url,
            alt: image.alt ?? null,
            sortOrder: index
          }))
        },
        postFiles: {
          create: files.map((file, index) => ({
            ...file,
            sortOrder: index
          }))
        }
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

async function main() {
  const prisma = new PrismaClient();

  try {
    await seedDatabase(prisma);
    console.info("Database seeded.");
  } finally {
    await prisma.$disconnect();
  }
}

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
