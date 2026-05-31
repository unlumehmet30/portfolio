import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { SectionHeader } from "@/components/ui/section-header";
import { getPosts } from "@/lib/api";
import type { Post } from "@/types/content";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Short technical notes by Mehmet Ünlü on forecasting, validation, metrics, optimization, visual odometry, and speech workflows."
};

async function loadPosts(): Promise<Post[]> {
  try {
    return await getPosts();
  } catch {
    return [];
  }
}

export default async function NotesPage() {
  const posts = await loadPosts();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <SectionHeader
        eyebrow="Notes"
        title="Small writeups from the workbench."
        description="Short writing around validation choices, metrics, optimization, visual odometry, and speech-processing workflows."
      />
      {posts.length ? (
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-border bg-card p-6 text-muted-foreground">
          No notes are available yet. Start the backend and seed the database.
        </div>
      )}
    </div>
  );
}
