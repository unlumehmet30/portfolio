import type { Metadata } from "next";
import { BrainCircuit, DatabaseZap, Gauge, GitBranch, ShieldCheck } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillBadge } from "@/components/SkillBadge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { getPosts, getProfile, getProjects } from "@/lib/api";
import { localizePosts, localizeProfile, localizeProjects } from "@/lib/content-localization";
import { localizePath } from "@/lib/locale";
import { defaultProfile } from "@/lib/site";
import { getUiCopy } from "@/lib/ui-copy";
import type { Post, Profile, Project } from "@/types/content";

export const metadata: Metadata = {
  title: {
    absolute: "Mehmet Ünlü | Portfolyo"
  },
  description:
    "Mehmet Ünlü'nün tahminleme, bilgisayarlı görü, optimizasyon, konuşma işleme ve Flutter projelerini içeren portfolyosu.",
  openGraph: {
    title: "Mehmet Ünlü | Portfolyo",
    description:
      "Tahminleme, bilgisayarlı görü, optimizasyon, konuşma işleme ve Flutter projeleri.",
    locale: "tr_TR",
    url: "/tr",
    images: ["/og.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehmet Ünlü | Portfolyo",
    description:
      "Tahminleme, bilgisayarlı görü, optimizasyon, konuşma işleme ve Flutter projeleri.",
    images: ["/og.svg"]
  }
};

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

const icons = [BrainCircuit, ShieldCheck, Gauge, DatabaseZap, GitBranch] as const;

export default async function TurkishHomePage() {
  const locale = "tr" as const;
  const copy = getUiCopy(locale).home;

  const [profileData, projectData, postData] = await Promise.all([
    safe<Profile>(getProfile(), defaultProfile),
    safe<Project[]>(getProjects(), []),
    safe<Post[]>(getPosts(), [])
  ]);
  const profile = localizeProfile(profileData, locale);
  const projects = localizeProjects(projectData, locale);
  const posts = localizePosts(postData, locale);
  const featured = projects.filter((project) => project.featured);
  const systems = copy.workOn.systems.map((item, index) => ({
    ...item,
    icon: icons[index]
  }));

  return (
    <>
      <HeroSection profile={profile} featuredProject={featured[0]} locale={locale} />

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-20">
        <SectionHeader
          eyebrow={copy.workOn.eyebrow}
          title={copy.workOn.title}
          description={copy.workOn.description}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {systems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-border bg-card p-5">
                <Icon className="text-accent" size={22} />
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={copy.selectedWork.eyebrow}
            title={copy.selectedWork.title}
            description={copy.selectedWork.description}
          />
          <ButtonLink href={localizePath(locale, "/projects")} variant="outline">{copy.selectedWork.allProjects}</ButtonLink>
        </div>
        {featured.length ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((project, index) => (
              <ProjectCard key={project.slug} project={project} priority={index === 0} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-border bg-card p-6 text-muted-foreground">
            {copy.selectedWork.empty}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-20">
        <SectionHeader
          eyebrow={copy.tools.eyebrow}
          title={copy.tools.title}
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            "Python",
            "LightGBM",
            "NumPy",
            "Pandas",
            "Scikit-learn",
            "PyTorch",
            "Hugging Face",
            "Whisper",
            "TypeScript",
            "Next.js",
            "Flutter",
            "Firebase",
            "Prisma"
          ].map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow={copy.notes.eyebrow}
            title={copy.notes.title}
          />
          <ButtonLink href={localizePath(locale, "/notes")} variant="outline">{copy.notes.readNotes}</ButtonLink>
        </div>
        {posts.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-border bg-card p-6 text-muted-foreground">
            {copy.notes.empty}
          </div>
        )}
      </section>
    </>
  );
}
