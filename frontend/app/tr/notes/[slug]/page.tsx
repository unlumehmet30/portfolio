import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts } from "@/lib/api";
import { siteUrl } from "@/lib/site";
import { getUiCopy } from "@/lib/ui-copy";
import type { Post } from "@/types/content";

const copy = getUiCopy("tr").notes;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

async function loadPost(slug: string): Promise<Post | null> {
  try {
    return await getPost(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    return {
      title: copy.fallbackDetailTitle
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/tr/notes/${post.slug}`,
      images: ["/og.svg"]
    }
  };
}

export default async function TurkishNoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <h1 className="mt-6 text-balance text-4xl font-semibold tracking-normal md:text-6xl">
        {post.title}
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
      <div className="mt-12">
        <MarkdownContent content={post.content} />
      </div>
    </article>
  );
}
