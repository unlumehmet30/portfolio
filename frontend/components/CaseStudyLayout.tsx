import { ExternalLink, Github } from "lucide-react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { MetricCard } from "@/components/MetricCard";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/ui-copy";
import type { Project } from "@/types/content";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-border pt-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CaseStudyLayout({ project, locale = "en" }: { project: Project; locale?: Locale }) {
  const copy = getUiCopy(locale).caseStudy;
  const details = project.caseStudy;
  const galleryImages = project.galleryImages ?? [];
  const galleryTitle = locale === "tr" ? "Proje Galerisi" : "Project Gallery";

  return (
    <article className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_0.28fr]">
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-normal md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{project.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.githubUrl ? (
              <ButtonLink href={project.githubUrl} variant="secondary">
                <Github size={17} />
                GitHub
              </ButtonLink>
            ) : null}
            {project.demoUrl ? (
              <ButtonLink href={project.demoUrl} variant="outline">
                <ExternalLink size={17} />
                {copy.demo}
              </ButtonLink>
            ) : null}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {project.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      <div className="mt-14">
        <ProjectVisual
          project={project}
          locale={locale}
          className="aspect-[16/7] md:min-h-[300px]"
          sizes="(min-width: 1200px) 1200px, 100vw"
        />
      </div>

      <ProjectGallery title={galleryTitle} projectTitle={project.title} images={galleryImages} locale={locale} />

      <div className="mt-16 grid gap-8 border-y border-border py-8 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.problem}</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.problem}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.challenge}</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.challenge}</p>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeader
          eyebrow={copy.architectureEyebrow}
          title={copy.architectureTitle}
          description={project.architecture}
        />
        <div className="mt-8">{details ? <ArchitectureDiagram type={details.diagram} locale={locale} /> : null}</div>
      </section>

      {details ? (
        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          <ListBlock title={copy.datasetInputs} items={[details.dataset]} />
          <ListBlock title={copy.technicalDecisions} items={details.technicalDecisions} />
          <ListBlock title={copy.implementationDetails} items={details.implementationDetails} />
          <ListBlock title={copy.metricsResults} items={[project.results]} />
          <ListBlock title={copy.lessonsLearned} items={details.lessonsLearned} />
          <ListBlock title={copy.futureImprovements} items={details.futureImprovements} />
        </section>
      ) : null}
    </article>
  );
}
