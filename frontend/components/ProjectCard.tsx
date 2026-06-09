"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { ProjectVisual } from "@/components/ProjectVisual";
import { localizePath, type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/ui-copy";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

export function ProjectCard({
  project,
  priority = false,
  locale = "en"
}: {
  project: Project;
  priority?: boolean;
  locale?: Locale;
}) {
  const copy = getUiCopy(locale).projectCard;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35 }}
      className={cn(priority && "md:col-span-2")}
    >
      <Link
        href={localizePath(locale, `/projects/${project.slug}`)}
        className={cn(
          "group block h-full border-t border-border pt-4",
          priority && "lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-8"
        )}
      >
        <ProjectVisual
          project={project}
          locale={locale}
          className={cn(
            "aspect-[16/10]",
            priority && "lg:aspect-auto lg:min-h-[420px]"
          )}
          sizes={priority ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
        />
        <div className={cn("pt-5", priority && "lg:flex lg:flex-col lg:justify-between lg:py-4")}>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {priority ? <span className="text-accent">{copy.featured}</span> : null}
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h3 className={cn("font-semibold tracking-normal text-foreground", priority ? "text-3xl" : "text-xl")}>
                {project.title}
              </h3>
              <ArrowUpRight className="mt-1 shrink-0 text-muted-foreground transition group-hover:text-accent" size={20} />
            </div>
            <p className={cn("mt-4 text-muted-foreground", priority ? "text-base leading-7" : "text-sm leading-6")}>
              {project.summary}
            </p>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-4">
              {project.metrics.slice(0, priority ? 4 : 2).map((metric) => (
                <div key={metric.label}>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{copy.caseStudy}</span>
              {project.githubUrl ? (
                <span className="inline-flex items-center gap-1">
                  <Github size={14} />
                  {copy.source}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
