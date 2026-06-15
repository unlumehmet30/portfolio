import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env.js";
import { ensureUploadDirectories, postFilesUploadsDir, uploadsRoot } from "./config/uploads.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";

function setUploadHeaders(res: express.Response, filePath: string) {
  if (!filePath.startsWith(postFilesUploadsDir)) {
    return;
  }

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    res.setHeader(
      "Content-Security-Policy",
      "sandbox; default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src 'self' data: https:; font-src data: https:;"
    );
    return;
  }

  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'");
}

function sanitizeDownloadName(value: string, fallback: string) {
  const name = path.basename(value).replace(/\.[^.]+$/, "");
  const safeName = name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return safeName || fallback;
}

export function createApp() {
  ensureUploadDirectories();

  const app = express();
  const allowedOrigins = env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.set("trust proxy", env.TRUST_PROXY);
  app.disable("x-powered-by");

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "same-site"
      },
      hsts: env.NODE_ENV === "production" ? undefined : false
    })
  );
  app.use((_req, res, next) => {
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
    next();
  });
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: false,
      methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/downloads/post-files/:filename", (req, res, next) => {
    const rawFilename = Array.isArray(req.params.filename) ? req.params.filename[0] : req.params.filename;
    const filename = path.basename(rawFilename);
    const extension = path.extname(filename).toLowerCase();

    if (filename !== rawFilename || ![".pdf", ".html", ".htm"].includes(extension)) {
      res.status(400).json({
        success: false,
        error: {
          message: "Invalid download filename",
          code: "BAD_REQUEST"
        }
      });
      return;
    }

    const filePath = path.join(postFilesUploadsDir, filename);
    const requestedName = typeof req.query.name === "string" ? req.query.name : filename;
    const downloadName = `${sanitizeDownloadName(requestedName, "note-file")}${extension}`;

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        error: {
          message: "Download file not found",
          code: "NOT_FOUND"
        }
      });
      return;
    }

    setUploadHeaders(res, filePath);
    res.setHeader("Cache-Control", "private, no-store");
    res.download(filePath, downloadName, (error) => {
      if (error && !res.headersSent) {
        next(error);
      }
    });
  });

  app.use("/api/uploads", express.static(uploadsRoot, {
    immutable: true,
    maxAge: "30d",
    setHeaders: setUploadHeaders
  }));
  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
