import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/api";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basePaths = ["", "/about", "/projects", "/notes", "/resume", "/contact"];
  const staticRoutes = [
    ...basePaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date()
    })),
    ...basePaths.map((path) => ({
      url: `${siteUrl}/tr${path}`,
      lastModified: new Date()
    }))
  ];

  try {
    const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt)
      })),
      ...projects.map((project) => ({
        url: `${siteUrl}/tr/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt)
      })),
      ...posts.map((post) => ({
        url: `${siteUrl}/notes/${post.slug}`,
        lastModified: new Date(post.updatedAt)
      })),
      ...posts.map((post) => ({
        url: `${siteUrl}/tr/notes/${post.slug}`,
        lastModified: new Date(post.updatedAt)
      }))
    ];
  } catch {
    return staticRoutes;
  }
}
