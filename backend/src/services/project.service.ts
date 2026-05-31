import type { Project } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { caseStudyDetails } from "../data/case-studies.js";
import { parseJsonField } from "../utils/json.js";
import { HttpError } from "../utils/http-error.js";

type Metric = {
  label: string;
  value: string;
  context: string;
};

function serializeProject(project: Project) {
  return {
    ...project,
    tags: parseJsonField<string[]>(project.tags, []),
    metrics: parseJsonField<Metric[]>(project.metrics, []),
    caseStudy: caseStudyDetails[project.slug] ?? null
  };
}

export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { id: "asc" }]
  });

  return projects.map(serializeProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug }
  });

  if (!project) {
    throw new HttpError("Project not found", 404, "NOT_FOUND");
  }

  return serializeProject(project);
}
