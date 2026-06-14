import { ExternalLink, FileText } from "lucide-react";
import type { Locale } from "@/lib/locale";
import type { PostFile } from "@/types/content";

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024))} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeLabel(file: PostFile) {
  return `${file.fileType.toUpperCase()}${file.sizeBytes ? ` · ${formatBytes(file.sizeBytes)}` : ""}`;
}

export function NoteFilePreview({ files, locale = "en" }: { files: PostFile[]; locale?: Locale }) {
  if (!files.length) {
    return null;
  }

  const heading = locale === "tr" ? "Not dosyaları" : "Note files";
  const openLabel = locale === "tr" ? "Yeni sekmede aç" : "Open in new tab";

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{heading}</h2>
      <div className="mt-5 grid gap-3">
        {files.map((file, index) => (
          <a
            key={`${file.url}-${index}`}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent hover:text-accent sm:flex-row sm:items-center sm:justify-between"
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${openLabel}: ${file.title}`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                <FileText size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{file.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{fileTypeLabel(file)}</p>
              </div>
            </div>
            <span className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
              <ExternalLink size={16} aria-hidden="true" />
              {openLabel}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
