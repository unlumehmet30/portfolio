import { getPostBySlug, getPosts } from "../services/post.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const postsController = asyncHandler(async (_req, res) => {
  const posts = await getPosts();
  sendSuccess(res, posts);
});

export const postDetailController = asyncHandler(async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const post = await getPostBySlug(slug);
  sendSuccess(res, post);
});
