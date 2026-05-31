import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Post } from "@/types/content";

export function BlogCard({ post }: { post: Post }) {
  return (
    <Card className="group h-full p-5 transition hover:-translate-y-1 hover:bg-muted/35">
      <Link href={`/notes/${post.slug}`} className="block h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <ArrowUpRight className="shrink-0 text-muted-foreground transition group-hover:text-accent" size={18} />
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-normal">{post.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      </Link>
    </Card>
  );
}
