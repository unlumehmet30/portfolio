import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/ui/section-header";
import { getProjects } from "@/lib/api";
import type { Project } from "@/types/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Project case studies by Mehmet Ünlü: forecasting, pipeline optimization, visual odometry, speech processing, and Flutter product work."
};

async function loadProjects(): Promise<Project[]> {
  try {
    return await getProjects();
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await loadProjects();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow="Projects"
        title="Selected work, written as case studies."
        description="These are not just tiles. Each project explains the context, the implementation choices, the measurements, and the parts that still need work."
      />
      {projects.length ? (
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-border bg-card p-6 text-muted-foreground">
          No projects are available yet. Start the backend and run the Prisma seed command.
        </div>
      )}
    </div>
  );
}
