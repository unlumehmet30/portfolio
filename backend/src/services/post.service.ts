import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";
import { parseJsonField } from "../utils/json.js";

type PostRecord = Awaited<ReturnType<typeof prisma.post.findFirst>>;

function serializePost(post: NonNullable<PostRecord>) {
  return {
    ...post,
    tags: parseJsonField<string[]>(post.tags, [])
  };
}

export async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  });

  return posts.map(serializePost);
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, published: true }
  });

  if (!post) {
    throw new HttpError("Post not found", 404, "NOT_FOUND");
  }

  return serializePost(post);
}
