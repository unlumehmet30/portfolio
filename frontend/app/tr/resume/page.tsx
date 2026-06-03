import type { Metadata } from "next";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { ResumeSection } from "@/components/ResumeSection";
import { SkillBadge } from "@/components/SkillBadge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { getResume } from "@/lib/api";
import { getUiCopy } from "@/lib/ui-copy";
import type { Resume } from "@/types/content";

const copy = getUiCopy("tr").resume;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription
};

const fallbackResume: Resume = {
  summary: copy.fallbackSummary,
  experience: [],
  projects: [],
  education: [],
  skills: [],
  tools: [],
  researchInterests: [],
  certifications: [],
  contact: {
    email: "unlu.mehmett1@gmail.com",
    githubUrl: "https://github.com/unlumehmet30",
    linkedinUrl: "https://www.linkedin.com/in/unlumehmett1"
  }
};

async function loadResume() {
  try {
    return await getResume();
  } catch {
    return fallbackResume;
  }
}

export default async function TurkishResumePage() {
  const resume = await loadResume();

  return (
    <div className="mx-auto max-w-[920px] px-4 py-16 sm:px-6 md:py-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={resume.summary}
        />
        <ButtonLink href="/resume.pdf" variant="secondary">
          <Download size={17} />
          {copy.downloadPdf}
        </ButtonLink>
      </div>

      <ResumeSection title={copy.sectionTitles.experience}>
        {resume.experience.length ? (
          <div className="space-y-6">
            {resume.experience.map((item) => (
              <div key={item.role}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-semibold">{item.role}</h3>
                  <p className="text-sm text-muted-foreground">{item.period}</p>
                </div>
                <p className="mt-1 text-muted-foreground">{item.organization}</p>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{copy.emptyExperience}</p>
        )}
      </ResumeSection>

      <ResumeSection title={copy.sectionTitles.projects}>
        <div className="grid gap-3 sm:grid-cols-2">
          {resume.projects.map((project) => (
            <div key={project} className="rounded-lg border border-border bg-card p-4">
              {project}
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title={copy.sectionTitles.education}>
        {resume.education.map((item) => (
          <div key={item.degree}>
            <h3 className="text-xl font-semibold">{item.degree}</h3>
            <p className="mt-1 text-muted-foreground">
              {item.school} · {item.period}
            </p>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title={copy.sectionTitles.skills}>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title={copy.sectionTitles.tools}>
        <div className="flex flex-wrap gap-2">
          {resume.tools.map((tool) => (
            <SkillBadge key={tool} label={tool} />
          ))}
        </div>
      </ResumeSection>

      {resume.researchInterests?.length ? (
        <ResumeSection title={copy.sectionTitles.researchInterests}>
          <div className="flex flex-wrap gap-2">
            {resume.researchInterests.map((interest) => (
              <SkillBadge key={interest} label={interest} />
            ))}
          </div>
        </ResumeSection>
      ) : null}

      {resume.certifications?.length ? (
        <ResumeSection title={copy.sectionTitles.certifications}>
          <div className="grid gap-3 sm:grid-cols-2">
            {resume.certifications.map((certification) => (
              <div key={certification} className="rounded-lg border border-border bg-card p-4">
                {certification}
              </div>
            ))}
          </div>
        </ResumeSection>
      ) : null}

      <ResumeSection title={copy.sectionTitles.contact}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${resume.contact.email}`} variant="outline">
            <Mail size={17} />
            {copy.links.email}
          </ButtonLink>
          <ButtonLink href={resume.contact.githubUrl} variant="outline">
            <Github size={17} />
            {copy.links.github}
          </ButtonLink>
          <ButtonLink href={resume.contact.linkedinUrl} variant="outline">
            <Linkedin size={17} />
            {copy.links.linkedin}
          </ButtonLink>
        </div>
      </ResumeSection>
    </div>
  );
}
