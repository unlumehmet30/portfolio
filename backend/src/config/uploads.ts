import fs from "fs";
import path from "path";
import { env } from "./env.js";

export const uploadsRoot = path.resolve(process.cwd(), env.UPLOADS_DIR);
export const projectUploadsDir = path.join(uploadsRoot, "projects");
export const postUploadsDir = path.join(uploadsRoot, "posts");

export function ensureUploadDirectories() {
  fs.mkdirSync(projectUploadsDir, { recursive: true });
  fs.mkdirSync(postUploadsDir, { recursive: true });
}

export function projectUploadUrl(filename: string) {
  return `/api/uploads/projects/${filename}`;
}

export function postUploadUrl(filename: string) {
  return `/api/uploads/posts/${filename}`;
}
