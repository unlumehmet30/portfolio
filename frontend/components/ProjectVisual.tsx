import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProjectVisual, type ProjectVisualKind } from "@/lib/project-visuals";
import type { Locale } from "@/lib/locale";
import type { Project } from "@/types/content";

function ForecastingArtwork() {
  const bars = [34, 48, 26, 64, 42, 78, 56, 88, 62, 72, 46, 82];

  return (
    <div className="absolute inset-x-[9%] top-[13%] bottom-[28%]">
      <div className="absolute inset-0 grid grid-rows-4">
        {[0, 1, 2, 3].map((line) => (
          <span key={line} className="border-t border-foreground/10" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-end gap-[3%]">
        {bars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="flex-1 bg-accent/35"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="absolute left-[4%] top-[38%] h-px w-[88%] -rotate-3 bg-accent shadow-[0_0_18px_hsl(var(--accent)/0.65)]" />
    </div>
  );
}

function OptimizationArtwork() {
  return (
    <div className="absolute inset-x-[10%] top-[18%] space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>before</span>
          <span>40m</span>
        </div>
        <div className="h-3 w-full bg-foreground/10">
          <div className="h-full w-full bg-foreground/35" />
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          <span>after</span>
          <span>4m</span>
        </div>
        <div className="h-3 w-full bg-foreground/10">
          <div className="h-full w-[10%] bg-accent shadow-[0_0_18px_hsl(var(--accent)/0.45)]" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[68, 42, 84, 56].map((width, index) => (
          <div key={`${width}-${index}`} className="border-t border-foreground/15 pt-2">
            <div className="h-1 bg-foreground/10">
              <div className="h-full bg-accent/55" style={{ width: `${width}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualOdometryArtwork() {
  return (
    <div className="absolute inset-x-[8%] top-[12%] bottom-[29%] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      {[0, 1].map((frame) => (
        <div key={frame} className="relative h-full border border-foreground/15 bg-foreground/[0.035]">
          <div className="absolute inset-x-[12%] top-[18%] h-px bg-accent/45" />
          <div className="absolute inset-y-[12%] left-[35%] w-px bg-accent/45" />
          <span className="absolute left-[20%] top-[32%] h-2 w-2 rounded-full border border-accent bg-background" />
          <span className="absolute right-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-accent/80" />
          <span className="absolute bottom-[22%] left-[48%] h-1.5 w-1.5 rounded-full bg-accent/60" />
          <span className="absolute bottom-[34%] right-[30%] h-2 w-2 rounded-full border border-accent/70" />
        </div>
      ))}
      <div className="font-mono text-xs text-accent">-&gt;</div>
    </div>
  );
}

function SpeechArtwork() {
  const waveform = [20, 48, 76, 34, 88, 58, 26, 64, 92, 44, 72, 30, 54, 82, 38, 66, 24];

  return (
    <div className="absolute inset-x-[9%] top-[18%] bottom-[31%]">
      <div className="flex h-28 items-center justify-center gap-[2%] border-y border-foreground/10">
        {waveform.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="w-1 bg-accent/65"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-px w-[82%] bg-foreground/15" />
        <div className="h-px w-[64%] bg-foreground/10" />
        <div className="h-px w-[74%] bg-foreground/10" />
      </div>
    </div>
  );
}

function MobileArtwork() {
  return (
    <div className="absolute inset-x-[18%] top-[9%] bottom-[28%] flex items-end justify-center gap-4">
      {[0, 1, 2].map((screen) => (
        <div
          key={screen}
          className={cn(
            "relative h-[78%] w-[25%] rounded-[18px] border border-foreground/15 bg-foreground/[0.035] p-2",
            screen === 1 && "h-full"
          )}
        >
          <div className="mx-auto h-1 w-8 rounded-full bg-foreground/15" />
          <div className="mt-4 aspect-square rounded-full border border-accent/45 bg-accent/10" />
          <div className="mt-4 h-1 bg-foreground/15" />
          <div className="mt-2 h-1 w-2/3 bg-foreground/10" />
          <div className="absolute inset-x-2 bottom-3 h-4 rounded-full bg-accent/35" />
        </div>
      ))}
    </div>
  );
}

function GenericArtwork() {
  return (
    <div className="absolute inset-[14%] border border-foreground/15">
      <div className="absolute left-[12%] top-[18%] h-px w-[72%] bg-accent/55" />
      <div className="absolute left-[12%] top-[36%] h-px w-[46%] bg-foreground/15" />
      <div className="absolute bottom-[18%] right-[12%] h-16 w-16 rounded-full border border-accent/40" />
    </div>
  );
}

function PlaceholderArtwork({ kind }: { kind: ProjectVisualKind }) {
  if (kind === "forecasting") return <ForecastingArtwork />;
  if (kind === "optimization") return <OptimizationArtwork />;
  if (kind === "visual-odometry") return <VisualOdometryArtwork />;
  if (kind === "speech") return <SpeechArtwork />;
  if (kind === "mobile") return <MobileArtwork />;
  return <GenericArtwork />;
}

export function ProjectVisual({
  project,
  locale = "en",
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw"
}: {
  project?: Pick<Project, "slug" | "title" | "imageUrl">;
  locale?: Locale;
  className?: string;
  sizes?: string;
}) {
  const visual = getProjectVisual(project?.slug);
  const imageSrc = project?.imageUrl || visual.src;
  const hasUploadedImage = Boolean(project?.imageUrl);
  const shouldSkipOptimization =
    Boolean(imageSrc) && (imageSrc!.startsWith("/api/uploads/") || imageSrc!.startsWith("http"));
  const placeholderLabel = locale === "tr" ? "Görsel yer tutucu" : "Visual placeholder";
  const fallbackTitle = locale === "tr" ? "Seçili proje görseli" : "Selected project visual";
  const imageAlt =
    project?.imageUrl && project?.title
      ? project.title
      : visual.alt[locale];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-border bg-card",
        hasUploadedImage && "media-color-stage",
        className
      )}
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes={sizes}
            unoptimized={shouldSkipOptimization}
            className={cn(hasUploadedImage ? "object-contain" : "object-cover", hasUploadedImage && "z-10")}
          />
          {hasUploadedImage ? (
            <>
              <div aria-hidden="true" className="media-color-tint pointer-events-none absolute inset-0 z-20" />
              <div aria-hidden="true" className="media-color-vignette pointer-events-none absolute inset-0 z-30" />
            </>
          ) : null}
        </>
      ) : (
        <>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-foreground/[0.03]" />
          <div aria-hidden="true" className="technical-grid absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="absolute inset-0">
            <PlaceholderArtwork kind={visual.kind} />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-border bg-background/88 px-4 py-3 backdrop-blur-sm">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                {placeholderLabel}
              </p>
              <p className="mt-1 truncate text-sm text-foreground">{project?.title ?? fallbackTitle}</p>
            </div>
            <code className="hidden shrink-0 text-[10px] text-muted-foreground sm:block">
              {visual.suggestedFile}
            </code>
          </div>
        </>
      )}
    </div>
  );
}
