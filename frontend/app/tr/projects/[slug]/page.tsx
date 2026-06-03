import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { getProject, getProjects } from "@/lib/api";
import { siteUrl } from "@/lib/site";
import type { Project } from "@/types/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

async function loadProject(slug: string): Promise<Project | null> {
  try {
    return await getProject(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    return {
      title: "Proje"
    };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${siteUrl}/tr/projects/${project.slug}`,
      images: ["/og.svg"]
    }
  };
}

export default async function TurkishProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyLayout project={project} locale="tr" />;
}
