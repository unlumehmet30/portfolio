import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { localizePath, type Locale } from "@/lib/locale";
import type { Post } from "@/types/content";

export function BlogCard({ post, locale = "en" }: { post: Post; locale?: Locale }) {
  return (
    <article className="h-full">
      <Link
        href={localizePath(locale, `/notes/${post.slug}`)}
        className="group block h-full border-t border-border pt-5 transition hover:border-accent"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <ArrowUpRight className="shrink-0 text-muted-foreground transition group-hover:text-accent" size={18} />
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-normal">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      </Link>
    </article>
  );
}
