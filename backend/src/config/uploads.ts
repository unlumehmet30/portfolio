import fs from "fs";
import path from "path";
import { env } from "./env.js";

export const uploadsRoot = path.resolve(process.cwd(), env.UPLOADS_DIR);
export const projectUploadsDir = path.join(uploadsRoot, "projects");

export function ensureUploadDirectories() {
  fs.mkdirSync(projectUploadsDir, { recursive: true });
}

export function projectUploadUrl(filename: string) {
  return `/api/uploads/projects/${filename}`;
}
