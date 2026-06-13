import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { resume as fallbackResume } from "../data/resume.js";
import { createAdminToken } from "../utils/admin-token.js";
import { HttpError } from "../utils/http-error.js";
import { parseJsonField } from "../utils/json.js";
import { slugify } from "../utils/slugify.js";

const optionalUrl = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.string().url().nullable().optional()
);

const imageUrl = z
  .string()
  .trim()
  .min(1)
  .refine((value) => {
    if (value.startsWith("/")) return true;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Image URL must be a relative path or a valid URL"
  });

const optionalImageUrl = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  imageUrl.nullable().optional()
);

const optionalImageAlt = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.string().trim().nullable().optional()
);

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export const profileSchema = z.object({
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  bio: z.string().trim().min(1),
  location: z.string().trim().min(1),
  email: z.string().trim().email(),
  githubUrl: z.string().trim().url(),
  linkedinUrl: z.string().trim().url(),
  resumeUrl: z.string().trim().min(1)
});

const metricSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
  context: z.string().trim().min(1)
});

const projectGalleryImageSchema = z.object({
  id: z.number().int().positive().optional(),
  url: imageUrl,
  alt: optionalImageAlt,
  sortOrder: z.number().int().nonnegative().optional()
});

const postTypeSchema = z.enum(["blog", "course-note", "visual-note", "cheatsheet"]);

const postImageSchema = z.object({
  id: z.number().int().positive().optional(),
  url: imageUrl,
  alt: optionalImageAlt,
  sortOrder: z.number().int().nonnegative().optional()
});

export const projectSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  summary: z.string().trim().min(1),
  description: z.string().trim().min(1),
  problem: z.string().trim().min(1),
  challenge: z.string().trim().min(1),
  architecture: z.string().trim().min(1),
  results: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
  metrics: z.array(metricSchema).default([]),
  imageUrl: optionalImageUrl,
  galleryImages: z.array(projectGalleryImageSchema).default([]),
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  featured: z.boolean().default(false)
});

export const postSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(1),
  content: z.string().trim().min(1),
  type: postTypeSchema.default("blog"),
  tags: z.array(z.string().trim().min(1)).default([]),
  coverImageUrl: optionalImageUrl,
  images: z.array(postImageSchema).default([]),
  published: z.boolean().default(false)
});

const resumeExperienceSchema = z.object({
  role: z.string().trim().min(1),
  organization: z.string().trim().min(1),
  period: z.string().trim().min(1),
  highlights: z.array(z.string().trim().min(1))
});

const resumeEducationSchema = z.object({
  degree: z.string().trim().min(1),
  school: z.string().trim().min(1),
  period: z.string().trim().min(1)
});

export const resumeSchema = z.object({
  summary: z.string().trim().min(1),
  experience: z.array(resumeExperienceSchema),
  projects: z.array(z.string().trim().min(1)),
  education: z.array(resumeEducationSchema),
  skills: z.array(z.string().trim().min(1)),
  tools: z.array(z.string().trim().min(1)),
  researchInterests: z.array(z.string().trim().min(1)).optional().default([]),
  certifications: z.array(z.string().trim().min(1)).optional().default([]),
  contact: z.object({
    email: z.string().trim().email(),
    githubUrl: z.string().trim().url(),
    linkedinUrl: z.string().trim().url()
  })
});

type ProjectImageRecord = {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: Date;
};

type ContentImageRecord = {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: Date;
};

function serializeProject(project: {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  challenge: string;
  architecture: string;
  results: string;
  tags: string;
  metrics: string;
  imageUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  projectImages?: ProjectImageRecord[];
}) {
  const { projectImages = [], ...projectData } = project;

  return {
    ...projectData,
    tags: parseJsonField<string[]>(project.tags, []),
    metrics: parseJsonField<z.infer<typeof metricSchema>[]>(project.metrics, []),
    galleryImages: projectImages.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt
    }))
  };
}

function normalizeProjectImages(images: z.infer<typeof projectGalleryImageSchema>[]) {
  return images.map((image, index) => ({
    url: image.url,
    alt: image.alt ?? null,
    sortOrder: image.sortOrder ?? index
  }));
}

function serializePost(post: {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: string;
  tags: string;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  postImages?: ContentImageRecord[];
}) {
  const { postImages = [], ...postData } = post;

  return {
    ...postData,
    type: postData.type || "blog",
    tags: parseJsonField<string[]>(post.tags, []),
    images: postImages.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt
    }))
  };
}

function normalizePostImages(images: z.infer<typeof postImageSchema>[]) {
  return images.map((image, index) => ({
    url: image.url,
    alt: image.alt ?? null,
    sortOrder: image.sortOrder ?? index
  }));
}

export async function loginAdmin(input: unknown) {
  const credentials = loginSchema.parse(input);

  if (
    credentials.username !== env.ADMIN_USERNAME ||
    credentials.password !== env.ADMIN_PASSWORD
  ) {
    throw new HttpError("Invalid admin credentials", 401, "BAD_REQUEST");
  }

  return {
    token: createAdminToken(credentials.username),
    user: {
      username: credentials.username,
      role: "admin"
    }
  };
}

export async function adminGetProfile() {
  return prisma.userProfile.findFirst();
}

export async function adminUpdateProfile(input: unknown) {
  const data = profileSchema.parse(input);

  return prisma.userProfile.upsert({
    where: { id: 1 },
    update: data,
    create: {
      id: 1,
      ...data
    }
  });
}

export async function adminListProjects() {
  const projects = await prisma.project.findMany({
    include: {
      projectImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    },
    orderBy: [{ featured: "desc" }, { id: "asc" }]
  });

  return projects.map(serializeProject);
}

export async function adminCreateProject(input: unknown) {
  const data = projectSchema.parse(input);
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const { galleryImages, ...projectData } = data;

  const project = await prisma.project.create({
    data: {
      ...projectData,
      slug,
      tags: JSON.stringify(projectData.tags),
      metrics: JSON.stringify(projectData.metrics),
      projectImages: {
        create: normalizeProjectImages(galleryImages)
      }
    },
    include: {
      projectImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    }
  });

  return serializeProject(project);
}

export async function adminUpdateProject(id: number, input: unknown) {
  const data = projectSchema.parse(input);
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const { galleryImages, ...projectData } = data;

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      slug,
      tags: JSON.stringify(projectData.tags),
      metrics: JSON.stringify(projectData.metrics),
      projectImages: {
        deleteMany: {},
        create: normalizeProjectImages(galleryImages)
      }
    },
    include: {
      projectImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    }
  });

  return serializeProject(project);
}

export async function adminDeleteProject(id: number) {
  await prisma.project.delete({
    where: { id }
  });

  return { id };
}

export async function adminListPosts() {
  const posts = await prisma.post.findMany({
    include: {
      postImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return posts.map(serializePost);
}

export async function adminCreatePost(input: unknown) {
  const data = postSchema.parse(input);
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const { images, ...postData } = data;

  const post = await prisma.post.create({
    data: {
      ...postData,
      slug,
      tags: JSON.stringify(postData.tags),
      postImages: {
        create: normalizePostImages(images)
      }
    },
    include: {
      postImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    }
  });

  return serializePost(post);
}

export async function adminUpdatePost(id: number, input: unknown) {
  const data = postSchema.parse(input);
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const { images, ...postData } = data;

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...postData,
      slug,
      tags: JSON.stringify(postData.tags),
      postImages: {
        deleteMany: {},
        create: normalizePostImages(images)
      }
    },
    include: {
      postImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    }
  });

  return serializePost(post);
}

export async function adminDeletePost(id: number) {
  await prisma.post.delete({
    where: { id }
  });

  return { id };
}

export async function adminListContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: [{ archived: "asc" }, { createdAt: "desc" }]
  });
}

export async function adminMarkContactMessageHandled(id: number) {
  return prisma.contactMessage.update({
    where: { id },
    data: {
      archived: true,
      handledAt: new Date()
    }
  });
}

export async function adminDeleteContactMessage(id: number) {
  await prisma.contactMessage.delete({
    where: { id }
  });

  return { id };
}

export async function adminGetResume() {
  const content = await prisma.siteContent.findUnique({
    where: { key: "resume" }
  });

  if (!content) {
    return fallbackResume;
  }

  return parseJsonField(content.value, fallbackResume);
}

export async function adminUpdateResume(input: unknown) {
  const data = resumeSchema.parse(input);

  const content = await prisma.siteContent.upsert({
    where: { key: "resume" },
    update: {
      value: JSON.stringify(data)
    },
    create: {
      key: "resume",
      value: JSON.stringify(data)
    }
  });

  return parseJsonField(content.value, data);
}
