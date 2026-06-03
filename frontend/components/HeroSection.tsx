"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, Github, Linkedin, Mail, MoveRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { localizePath, type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/ui-copy";
import type { Profile, Project } from "@/types/content";

function WorkbenchVisual({ featuredProject, locale }: { featuredProject?: Project; locale: Locale }) {
  const copy = getUiCopy(locale).hero.workbench;
  const metrics = featuredProject?.metrics ?? copy.defaultMetrics;
  const notes = copy.notes;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative min-h-[430px] overflow-hidden rounded-lg border border-border bg-card p-5 shadow-glow"
    >
      <div className="absolute inset-0 technical-grid opacity-35" />
      <div className="relative z-10 grid gap-4">
        <div className="rounded-lg border border-border bg-background/80 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{copy.cardTitle}</p>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{copy.location}</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-normal">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.slice(0, 4).map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 + index * 0.08 }}
              className="rounded-lg border border-border bg-background/78 p-4 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
              <p className="mt-2 font-mono text-xl font-semibold text-foreground">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.context}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-background/78 p-4 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.buildNotesTitle}</p>
          <div className="mt-4 space-y-3">
            {notes.map((note) => (
              <div key={note} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <CheckCircle2 className="mt-1 shrink-0 text-accent" size={16} />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection({
  profile,
  featuredProject,
  locale = "en"
}: {
  profile: Profile;
  featuredProject?: Project;
  locale?: Locale;
}) {
  const copy = getUiCopy(locale).hero;

  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
        <p className="mb-5 inline-flex rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">{copy.badge}</p>
        <h1 className="text-balance text-5xl font-semibold tracking-normal md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-5 text-2xl text-muted-foreground md:text-3xl">{profile.title}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {copy.introPrimary}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {copy.introSecondary}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={localizePath(locale, "/projects")}>
            {copy.actions.projects}
            <MoveRight size={17} />
          </ButtonLink>
          <ButtonLink href={profile.resumeUrl} variant="secondary">
            <Download size={17} />
            {copy.actions.downloadCv}
          </ButtonLink>
          <ButtonLink href={profile.githubUrl} variant="outline">
            <Github size={17} />
            {copy.actions.github}
          </ButtonLink>
          <ButtonLink href={profile.linkedinUrl} variant="outline">
            <Linkedin size={17} />
            {copy.actions.linkedin}
          </ButtonLink>
          <ButtonLink href={localizePath(locale, "/contact")} variant="ghost">
            <Mail size={17} />
            {copy.actions.contact}
          </ButtonLink>
        </div>
      </motion.div>
      <WorkbenchVisual featuredProject={featuredProject} locale={locale} />
    </section>
  );
}
