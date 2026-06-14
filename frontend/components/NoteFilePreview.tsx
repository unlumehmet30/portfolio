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
      <div className="mt-5 grid gap-6">
        {files.map((file, index) => (
          <article key={`${file.url}-${index}`} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{file.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{fileTypeLabel(file)}</p>
              </div>
              <a className="text-sm font-medium text-accent hover:underline" href={file.url} target="_blank" rel="noreferrer">
                {openLabel}
              </a>
            </div>
            {file.fileType === "pdf" ? (
              <iframe
                src={file.url}
                title={file.title}
                loading="lazy"
                className="h-[680px] w-full bg-background"
              />
            ) : (
              <iframe
                src={file.url}
                title={file.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox=""
                className="h-[680px] w-full bg-white"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
