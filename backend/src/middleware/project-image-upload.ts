import { randomUUID } from "crypto";
import path from "path";
import multer from "multer";
import { ensureUploadDirectories, projectUploadsDir } from "../config/uploads.js";

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"]
]);

ensureUploadDirectories();

export const projectImageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, projectUploadsDir);
    },
    filename: (_req, file, callback) => {
      const extension =
        allowedMimeTypes.get(file.mimetype) ||
        path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error("Only JPEG, PNG, WebP, and GIF images are allowed."));
      return;
    }

    callback(null, true);
  }
});
