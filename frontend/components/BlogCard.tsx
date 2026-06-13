import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/locale";
import { getNoteTypeLabel } from "@/lib/note-types";
import type { Post } from "@/types/content";

function shouldSkipOptimization(src: string) {
  return src.startsWith("/api/uploads/") || src.startsWith("http");
}

export function BlogCard({ post, locale = "en" }: { post: Post; locale?: Locale }) {
  return (
    <article className="h-full">
      <Link
        href={localizePath(locale, `/notes/${post.slug}`)}
        className="group block h-full border-t border-border pt-5 transition hover:border-accent"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-accent">{getNoteTypeLabel(post.type, locale)}</span>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <ArrowUpRight className="shrink-0 text-muted-foreground transition group-hover:text-accent" size={18} />
        </div>
        {post.coverImageUrl ? (
          <div className="media-color-stage relative mt-5 aspect-[16/9] overflow-hidden border border-border">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              unoptimized={shouldSkipOptimization(post.coverImageUrl)}
              className="z-10 object-contain"
            />
            <div aria-hidden="true" className="media-color-tint pointer-events-none absolute inset-0 z-20" />
            <div aria-hidden="true" className="media-color-vignette pointer-events-none absolute inset-0 z-30" />
          </div>
        ) : null}
        <h3 className="mt-6 text-xl font-semibold tracking-normal">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      </Link>
    </article>
  );
}
