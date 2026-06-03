import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { getUiCopy } from "@/lib/ui-copy";

const copy = getUiCopy("en").about;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.68fr_0.32fr]">
        <div className="space-y-6 text-lg leading-8 text-muted-foreground">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{copy.focusAreasTitle}</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            {copy.focusAreas.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
