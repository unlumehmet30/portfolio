import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { RequestHandler } from "express";
import multer from "multer";
import { ensureUploadDirectories, postUploadsDir, projectUploadsDir } from "../config/uploads.js";
import { HttpError } from "../utils/http-error.js";

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"]
]);

ensureUploadDirectories();

function hasImageSignature(file: Express.Multer.File, bytes: Buffer) {
  if (file.mimetype === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (file.mimetype === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (file.mimetype === "image/webp") {
    return bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }

  if (file.mimetype === "image/gif") {
    const signature = bytes.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }

  return false;
}

export const validateImageSignature: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const fileBytes = await fs.readFile(req.file.path);

    if (hasImageSignature(req.file, fileBytes)) {
      next();
      return;
    }

    await fs.unlink(req.file.path).catch(() => undefined);
    next(new HttpError("Uploaded file content does not match an allowed image type.", 400, "BAD_REQUEST"));
  } catch (error) {
    next(error);
  }
};

function createImageUpload(destination: string) {
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => {
        callback(null, destination);
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
        callback(new HttpError("Only JPEG, PNG, WebP, and GIF images are allowed.", 400, "BAD_REQUEST"));
        return;
      }

      callback(null, true);
    }
  });
}

export const projectImageUpload = createImageUpload(projectUploadsDir);
export const postImageUpload = createImageUpload(postUploadsDir);
