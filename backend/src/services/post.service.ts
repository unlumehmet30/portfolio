import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http-error.js";
import { parseJsonField } from "../utils/json.js";

type PostRecord = Awaited<ReturnType<typeof prisma.post.findFirst>>;
type ContentImageRecord = {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number;
  createdAt: Date;
};

function serializePost(post: NonNullable<PostRecord> & { postImages?: ContentImageRecord[] }) {
  const { postImages = [], ...postData } = post;

  return {
    ...postData,
    type: postData.type || "blog",
    tags: parseJsonField<string[]>(post.tags, []),
    images: postImages.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      createdAt: image.createdAt
    }))
  };
}

export async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      postImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return posts.map(serializePost);
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    include: {
      postImages: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }
    }
  });

  if (!post) {
    throw new HttpError("Post not found", 404, "NOT_FOUND");
  }

  return serializePost(post);
}
