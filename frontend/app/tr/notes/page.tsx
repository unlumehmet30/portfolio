import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { SectionHeader } from "@/components/ui/section-header";
import { getPosts } from "@/lib/api";
import { localizePosts } from "@/lib/content-localization";
import { getUiCopy } from "@/lib/ui-copy";
import type { Post } from "@/types/content";

const copy = getUiCopy("tr").notes;

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription
};

async function loadPosts(): Promise<Post[]> {
  try {
    return await getPosts();
  } catch {
    return [];
  }
}

export default async function TurkishNotesPage() {
  const posts = localizePosts(await loadPosts(), "tr");

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      {posts.length ? (
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale="tr" />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-border bg-card p-6 text-muted-foreground">
          {copy.empty}
        </div>
      )}
    </div>
  );
}
