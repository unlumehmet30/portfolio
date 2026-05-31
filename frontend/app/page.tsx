import { BrainCircuit, DatabaseZap, Gauge, GitBranch, ShieldCheck } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillBadge } from "@/components/SkillBadge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { getPosts, getProfile, getProjects } from "@/lib/api";
import { defaultProfile } from "@/lib/site";
import type { Post, Profile, Project } from "@/types/content";

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

const systems = [
  {
    icon: BrainCircuit,
    title: "Forecasting",
    description: "Sparse demand, rolling validation, and recursive predictions without peeking into the future."
  },
  {
    icon: ShieldCheck,
    title: "Validation",
    description: "Checking whether the setup is fair before trusting the score."
  },
  {
    icon: Gauge,
    title: "Speed",
    description: "Replacing slow loops and repeated work with cleaner, faster data transforms."
  },
  {
    icon: DatabaseZap,
    title: "Pipelines",
    description: "Small backend and data workflows that keep projects usable end to end."
  },
  {
    icon: GitBranch,
    title: "Experiments",
    description: "Computer vision, speech processing, and mobile ideas tested as working prototypes."
  }
];

export default async function HomePage() {
  const [profile, projects, posts] = await Promise.all([
    safe<Profile>(getProfile(), defaultProfile),
    safe<Project[]>(getProjects(), []),
    safe<Post[]>(getPosts(), [])
  ]);
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <HeroSection profile={profile} featuredProject={featured[0]} />

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-20">
        <SectionHeader
          eyebrow="What I Work On"
          title="I care about models that survive contact with real data."
          description="Most of my work starts with an awkward constraint: too many zeros, slow feature code, noisy motion, or a validation setup that needs to be treated carefully."
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
            eyebrow="Selected Work"
            title="Projects written with the tradeoffs left in."
            description="Each case study explains the problem, what I tried, what I measured, and where the constraints shaped the implementation."
          />
          <ButtonLink href="/projects" variant="outline">All projects</ButtonLink>
        </div>
        {featured.length ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((project, index) => (
              <ProjectCard key={project.slug} project={project} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-border bg-card p-6 text-muted-foreground">
            Start the backend and seed the database to load featured projects.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-20">
        <SectionHeader
          eyebrow="Tools"
          title="Tools I reach for when the problem calls for them."
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
            eyebrow="Notes"
            title="Short notes from the build log."
          />
          <ButtonLink href="/notes" variant="outline">Read notes</ButtonLink>
        </div>
        {posts.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-border bg-card p-6 text-muted-foreground">
            Notes will appear here after the backend is running.
          </div>
        )}
      </section>
    </>
  );
}
