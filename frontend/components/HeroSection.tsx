"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, Github, Linkedin, Mail, MoveRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Profile, Project } from "@/types/content";

function WorkbenchVisual({ featuredProject }: { featuredProject?: Project }) {
  const metrics = featuredProject?.metrics ?? [
    { label: "Products", value: "20K+", context: "Sparse daily series" },
    { label: "Rows", value: "3M+", context: "Feature workload" },
    { label: "Runtime", value: "40m -> 4m", context: "Pipeline cleanup" },
    { label: "Drone footage", value: "7.5 FPS", context: "VO experiments" }
  ];

  const notes = [
    "Keep validation close to the way the project would actually run.",
    "Measure the boring parts: runtime, memory, leakage, and failure cases.",
    "Write case studies so the tradeoffs are visible, not hidden."
  ];

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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Current desk</p>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Istanbul / ITU</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-normal">
            Forecasting, computer vision, and making slow data code less painful.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The strongest projects here come from real constraints: many zero-demand rows,
            drone footage that needs careful motion estimates, and pipelines that must be fast
            enough to iterate on.
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Build notes</p>
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

export function HeroSection({ profile, featuredProject }: { profile: Profile; featuredProject?: Project }) {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
        <p className="mb-5 inline-flex rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">
          ITU Electronics and Communication Engineering
        </p>
        <h1 className="text-balance text-5xl font-semibold tracking-normal md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-5 text-2xl text-muted-foreground md:text-3xl">{profile.title}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          I work on forecasting, computer vision, and practical tooling around data and models through hands-on
          projects and early product work.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          I like problems where the model is only part of the story: messy data, validation
          decisions, runtime limits, and the small engineering choices that make an experiment usable.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projects">
            View Projects
            <MoveRight size={17} />
          </ButtonLink>
          <ButtonLink href={profile.resumeUrl} variant="secondary">
            <Download size={17} />
            Download CV
          </ButtonLink>
          <ButtonLink href={profile.githubUrl} variant="outline">
            <Github size={17} />
            GitHub
          </ButtonLink>
          <ButtonLink href={profile.linkedinUrl} variant="outline">
            <Linkedin size={17} />
            LinkedIn
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            <Mail size={17} />
            Contact
          </ButtonLink>
        </div>
      </motion.div>
      <WorkbenchVisual featuredProject={featuredProject} />
    </section>
  );
}
