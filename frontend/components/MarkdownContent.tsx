import Image from "next/image";

function shouldSkipOptimization(src: string) {
  return src.startsWith("/api/uploads/") || src.startsWith("http");
}

export function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-5 text-base leading-8 text-muted-foreground">
      {blocks.map((block, index) => {
        const imageMatch = block.match(/^!\[(.*)]\((.*)\)$/);

        if (imageMatch) {
          const [, alt, src] = imageMatch;

          return (
            <div key={`${block}-${index}`} className="media-color-stage relative aspect-video overflow-hidden border border-border">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                unoptimized={shouldSkipOptimization(src)}
                className="z-10 object-contain"
              />
              <div aria-hidden="true" className="media-color-tint pointer-events-none absolute inset-0 z-20" />
              <div aria-hidden="true" className="media-color-vignette pointer-events-none absolute inset-0 z-30" />
            </div>
          );
        }

        if (block.startsWith("# ")) {
          return (
            <h1 key={`${block}-${index}`} className="text-3xl font-semibold text-foreground">
              {block.replace("# ", "")}
            </h1>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2 key={`${block}-${index}`} className="text-2xl font-semibold text-foreground">
              {block.replace("## ", "")}
            </h2>
          );
        }

        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={`${block}-${index}`} className="space-y-2">
              {block.split("\n").map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{line.replace("- ", "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={`${block}-${index}`}>{block}</p>;
      })}
    </div>
  );
}
