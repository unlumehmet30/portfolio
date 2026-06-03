"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { localizePath, type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/ui-copy";
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="group h-full overflow-hidden bg-card/92 shadow-soft-card">
        <Link href={localizePath(locale, `/projects/${project.slug}`)} className="block h-full p-5">
          <div className="mb-5 flex min-h-28 items-end rounded-lg border border-border bg-muted/45 p-4">
            <div className="grid w-full grid-cols-3 gap-2">
              {project.metrics.slice(0, 3).map((metric) => (
                <div key={metric.label} className="rounded-md border border-border bg-background/65 p-2">
                  <p className="truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 truncate font-mono text-sm font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {priority ? <Badge className="border-accent/30 bg-accent/10 text-accent">{copy.featured}</Badge> : null}
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold tracking-normal text-foreground">{project.title}</h3>
            </div>
            <ArrowUpRight className="mt-1 shrink-0 text-muted-foreground transition group-hover:text-accent" size={20} />
          </div>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.summary}</p>
          <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
            <span>{copy.caseStudy}</span>
            {project.githubUrl ? (
              <span className="inline-flex items-center gap-1">
                <Github size={14} />
                {copy.source}
              </span>
            ) : null}
          </div>
        </Link>
      </Card>
    </motion.article>
  );
}
