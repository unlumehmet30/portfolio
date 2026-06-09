"use client";

import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, MoveRight } from "lucide-react";
import { ProjectVisual } from "@/components/ProjectVisual";
import { ButtonLink } from "@/components/ui/button";
import { localizePath, type Locale } from "@/lib/locale";
import { getUiCopy } from "@/lib/ui-copy";
import type { Profile, Project } from "@/types/content";

function FeaturedProjectVisual({ featuredProject, locale }: { featuredProject?: Project; locale: Locale }) {
  const copy = getUiCopy(locale).hero.workbench;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative"
    >
      <ProjectVisual
        project={featuredProject}
        locale={locale}
        className="aspect-[16/11] shadow-glow lg:min-h-[430px]"
        sizes="(min-width: 1024px) 52vw, 100vw"
      />
      <div className="mt-5 border-t border-border pt-4 sm:flex sm:items-start sm:justify-between sm:gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{copy.cardTitle}</p>
          <h2 className="mt-2 max-w-md text-xl font-semibold tracking-normal">
            {featuredProject?.title ?? copy.title}
          </h2>
        </div>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:mt-0">
          {featuredProject?.summary ?? copy.description}
        </p>
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
    <section className="relative overflow-hidden border-b border-border/70">
      <div aria-hidden="true" className="technical-grid absolute inset-y-0 right-0 hidden w-[54%] opacity-25 lg:block" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
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
        <FeaturedProjectVisual featuredProject={featuredProject} locale={locale} />
      </div>
    </section>
  );
}
