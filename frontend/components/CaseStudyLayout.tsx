import { ExternalLink, Github } from "lucide-react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import type { Project } from "@/types/content";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
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

export function CaseStudyLayout({ project }: { project: Project }) {
  const details = project.caseStudy;

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
                Demo
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

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Problem</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.problem}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Challenge</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.challenge}</p>
        </div>
      </div>

      <section className="mt-16">
        <SectionHeader
          eyebrow="Architecture"
          title="How the pieces fit together."
          description={project.architecture}
        />
        <div className="mt-8">{details ? <ArchitectureDiagram type={details.diagram} /> : null}</div>
      </section>

      {details ? (
        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          <ListBlock title="Dataset / Inputs" items={[details.dataset]} />
          <ListBlock title="Technical Decisions" items={details.technicalDecisions} />
          <ListBlock title="Implementation Details" items={details.implementationDetails} />
          <ListBlock title="Metrics / Results" items={[project.results]} />
          <ListBlock title="Lessons Learned" items={details.lessonsLearned} />
          <ListBlock title="Future Improvements" items={details.futureImprovements} />
        </section>
      ) : null}
    </article>
  );
}
