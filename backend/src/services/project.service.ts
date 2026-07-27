import { prisma } from "../config/prisma.js";
import { caseStudyDetails } from "../data/case-studies.js";
import { parseJsonField } from "../utils/json.js";
import { HttpError } from "../utils/http-error.js";

type Metric = {
  label: string;
  value: string;
  context: string;
};

type Contributor = {
  name: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

type ProjectRecord = Awaited<ReturnType<typeof prisma.project.findFirst>>;
type ProjectImageRecord = {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: Date;
};

function serializeProject(project: NonNullable<ProjectRecord> & { projectImages?: ProjectImageRecord[] }) {
  const { projectImages = [], ...projectData } = project;

  return {
    ...projectData,
    tags: parseJsonField<string[]>(project.tags, []),
    metrics: parseJsonField<Metric[]>(project.metrics, []),
    contributors: parseJsonField<Contributor[]>(project.contributors, []),
    galleryImages: projectImages.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt
    })),
    caseStudy: caseStudyDetails[project.slug] ?? null
  };
}

export async function getProjects() {
  const projects = await prisma.project.findMany({
    include: {
      projectImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    },
    orderBy: [{ sortOrder: "asc" }, { featured: "desc" }, { id: "asc" }]
  });

  return projects.map(serializeProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      projectImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    }
  });

  if (!project) {
    throw new HttpError("Project not found", 404, "NOT_FOUND");
  }

  return serializeProject(project);
}
