import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

function shouldSkipOptimization(src: string) {
  return src.startsWith("/api/uploads/") || src.startsWith("http");
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 text-3xl font-semibold leading-tight text-foreground first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-9 text-2xl font-semibold leading-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-7 text-xl font-semibold leading-tight text-foreground first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => <p>{children}</p>,
  a: ({ href, children }) => (
    <a
      className="font-medium text-accent underline-offset-4 hover:underline"
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="space-y-2 pl-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-3">
      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent pl-4 text-foreground">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => (
    <code className={`${className ?? ""} rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground`}>
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm leading-6 text-foreground">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border bg-muted/50 px-3 py-2 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-border px-3 py-2">{children}</td>,
  img: ({ src, alt }) => {
    if (!src) {
      return null;
    }

    const imageSrc = String(src);

    return (
      <span className="media-color-stage relative block aspect-video overflow-hidden border border-border">
        <Image
          src={imageSrc}
          alt={alt ?? ""}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          unoptimized={shouldSkipOptimization(imageSrc)}
          className="z-10 object-contain"
        />
        <span aria-hidden="true" className="media-color-tint pointer-events-none absolute inset-0 z-20" />
        <span aria-hidden="true" className="media-color-vignette pointer-events-none absolute inset-0 z-30" />
      </span>
    );
  }
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="note-markdown space-y-5 text-base leading-8 text-muted-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
