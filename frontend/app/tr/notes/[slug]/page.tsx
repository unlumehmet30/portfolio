import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { NoteFilePreview } from "@/components/NoteFilePreview";
import { Badge } from "@/components/ui/badge";
import { getPost, getPosts } from "@/lib/api";
import { localizePost } from "@/lib/content-localization";
import { getNoteTypeLabel } from "@/lib/note-types";
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

function shouldSkipOptimization(src: string) {
  return src.startsWith("/api/uploads/") || src.startsWith("http");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const postData = await loadPost(slug);
  const post = postData ? localizePost(postData, "tr") : null;

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
      images: [post.coverImageUrl || "/og.svg"]
    }
  };
}

export default async function TurkishNoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const postData = await loadPost(slug);
  const post = postData ? localizePost(postData, "tr") : null;

  if (!post) {
    notFound();
  }
  const detailImages = (post.images ?? []).filter((image) => image.url !== post.coverImageUrl);

  return (
    <article className="mx-auto max-w-[920px] px-4 py-16 sm:px-6 md:py-24">
      <div className="flex flex-wrap gap-2">
        <Badge>{getNoteTypeLabel(post.type, "tr")}</Badge>
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <h1 className="mt-6 text-balance text-4xl font-semibold tracking-normal md:text-6xl">
        {post.title}
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
      {post.coverImageUrl ? (
        <div className="media-color-stage relative mt-10 aspect-[16/9] overflow-hidden border border-border">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="(min-width: 920px) 920px, 100vw"
            unoptimized={shouldSkipOptimization(post.coverImageUrl)}
            className="z-10 object-contain"
          />
          <div aria-hidden="true" className="media-color-tint pointer-events-none absolute inset-0 z-20" />
          <div aria-hidden="true" className="media-color-vignette pointer-events-none absolute inset-0 z-30" />
        </div>
      ) : null}
      <div className="mt-12">
        <MarkdownContent content={post.content} />
      </div>
      {detailImages.length ? (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Görseller</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {detailImages.map((image, index) => (
              <div key={`${image.url}-${index}`} className="media-color-stage relative aspect-video overflow-hidden border border-border">
                <Image
                  src={image.url}
                  alt={image.alt || `${post.title} görsel ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized={shouldSkipOptimization(image.url)}
                  className="z-10 object-contain"
                />
                <div aria-hidden="true" className="media-color-tint pointer-events-none absolute inset-0 z-20" />
                <div aria-hidden="true" className="media-color-vignette pointer-events-none absolute inset-0 z-30" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <NoteFilePreview files={post.files ?? []} locale="tr" />
    </article>
  );
}
