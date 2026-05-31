import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Mehmet Ünlü, an ITU Electronics and Communication Engineering student working on forecasting, computer vision, and practical ML projects."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow="About"
        title="I learn best by building things that can be tested."
        description="I am an Electronics and Communication Engineering student at Istanbul Technical University. My work mostly sits around forecasting, computer vision, speech processing, and making ML code easier to run and reason about."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.68fr_0.32fr]">
        <div className="space-y-6 text-lg leading-8 text-muted-foreground">
          <p>
            I am drawn to projects where the hard part is not only choosing a model. Forecasting
            sparse demand, for example, forced me to think about validation, zero-heavy targets,
            recursive prediction, and whether the features would actually exist at prediction time.
          </p>
          <p>
            On the computer vision side, I have been experimenting with visual odometry ideas on
            drone footage. On the product side, I have worked with Flutter, Firebase, and speech or
            story-generation flows. Some of it is research-like, some of it is product-like, but I try
            to keep the work concrete.
          </p>
          <p>
            I care about leaving a trail: what changed, what improved, what failed, and what I would
            do differently. That is why the projects here are written as case studies instead of only
            screenshots and tags.
          </p>
        </div>
        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Focus Areas</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Sparse demand forecasting and careful validation.</p>
            <p>Feature engineering, vectorization, and runtime cleanup.</p>
            <p>Computer vision experiments on motion and perception.</p>
            <p>Speech processing, subtitles, and practical NLP workflows.</p>
            <p>Mobile product prototypes with Flutter and Firebase.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
