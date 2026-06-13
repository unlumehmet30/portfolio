"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/BlogCard";
import type { Locale } from "@/lib/locale";
import { getNoteTypeLabel, normalizeNoteType, noteTypeOptions } from "@/lib/note-types";
import { cn } from "@/lib/utils";
import type { Post, PostType } from "@/types/content";

type FilterValue = "all" | PostType;

export function NotesFilter({ posts, locale = "en" }: { posts: Post[]; locale?: Locale }) {
  const [activeType, setActiveType] = useState<FilterValue>("all");
  const availableTypes = useMemo(
    () => noteTypeOptions.filter((type) => posts.some((post) => normalizeNoteType(post.type) === type.value)),
    [posts]
  );
  const visiblePosts = useMemo(
    () => activeType === "all" ? posts : posts.filter((post) => normalizeNoteType(post.type) === activeType),
    [activeType, posts]
  );
  const allLabel = locale === "tr" ? "Tümü" : "All";
  const emptyLabel = locale === "tr" ? "Bu türde henüz not yok." : "No notes in this category yet.";

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cn(
            "rounded-md border px-3 py-2 text-sm transition",
            activeType === "all"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          onClick={() => setActiveType("all")}
        >
          {allLabel}
        </button>
        {availableTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            className={cn(
              "rounded-md border px-3 py-2 text-sm transition",
              activeType === type.value
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => setActiveType(type.value)}
          >
            {getNoteTypeLabel(type.value, locale)}
          </button>
        ))}
      </div>

      {visiblePosts.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-border bg-card p-6 text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
