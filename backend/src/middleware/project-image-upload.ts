import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { RequestHandler } from "express";
import multer from "multer";
import { ensureUploadDirectories, postFilesUploadsDir, postUploadsDir, projectUploadsDir } from "../config/uploads.js";
import { HttpError } from "../utils/http-error.js";
import { renderHtmlMathFile } from "../utils/html-math.js";

const allowedMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"]
]);

const allowedPostFileMimeTypes = new Map([
  ["application/pdf", ".pdf"],
  ["text/html", ".html"]
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

function hasPostFileSignature(file: Express.Multer.File, bytes: Buffer) {
  if (file.mimetype === "application/pdf") {
    return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  }

  if (file.mimetype === "text/html") {
    const preview = bytes.subarray(0, Math.min(bytes.length, 4096)).toString("utf8").trimStart().toLowerCase();
    return preview.startsWith("<!doctype html") || preview.startsWith("<html") || preview.includes("<body");
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

export const validatePostFileSignature: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const fileBytes = await fs.readFile(req.file.path);

    if (hasPostFileSignature(req.file, fileBytes)) {
      if (req.file.mimetype === "text/html") {
        await renderHtmlMathFile(req.file.path);
      }

      next();
      return;
    }

    await fs.unlink(req.file.path).catch(() => undefined);
    next(new HttpError("Uploaded file content does not match an allowed note file type.", 400, "BAD_REQUEST"));
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

export const postFileUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, postFilesUploadsDir);
    },
    filename: (_req, file, callback) => {
      const extension =
        allowedPostFileMimeTypes.get(file.mimetype) ||
        path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedPostFileMimeTypes.has(file.mimetype)) {
      callback(new HttpError("Only PDF and HTML note files are allowed.", 400, "BAD_REQUEST"));
      return;
    }

    callback(null, true);
  }
});
