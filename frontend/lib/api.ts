import postsData from "@/content/posts.json";
import profileData from "@/content/profile.json";
import projectsData from "@/content/projects.json";
import resumeData from "@/content/resume.json";
import type { Post, Profile, Project, Resume } from "@/types/content";

const profile = profileData as Profile;
const projects = projectsData as Project[];
const posts = postsData as Post[];
const resume = resumeData as Resume;

export async function getProfile() {
  return profile;
}

export async function getProjects() {
  return projects;
}

export async function getProject(slug: string) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function getPosts() {
  return posts.filter((post) => post.published);
}

export async function getPost(slug: string) {
  const post = posts.find((item) => item.slug === slug && item.published);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

export async function getResume() {
  return resume;
}
