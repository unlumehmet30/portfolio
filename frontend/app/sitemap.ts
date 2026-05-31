import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/api";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/projects", "/notes", "/resume", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date()
  }));

  try {
    const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt)
      })),
      ...posts.map((post) => ({
        url: `${siteUrl}/notes/${post.slug}`,
        lastModified: new Date(post.updatedAt)
      }))
    ];
  } catch {
    return staticRoutes;
  }
}
