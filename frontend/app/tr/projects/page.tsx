import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/ui/section-header";
import { getProjects } from "@/lib/api";
import { getUiCopy } from "@/lib/ui-copy";
import type { Project } from "@/types/content";

const copy = getUiCopy("tr").projects;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription
};

async function loadProjects(): Promise<Project[]> {
  try {
    return await getProjects();
  } catch {
    return [];
  }
}

export default async function TurkishProjectsPage() {
  const projects = await loadProjects();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      {projects.length ? (
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} locale="tr" />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-border bg-card p-6 text-muted-foreground">
          {copy.empty}
        </div>
      )}
    </div>
  );
}
