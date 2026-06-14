import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
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

  if (filePath.endsWith(".html") || filePath.endsWith(".htm")) {
    res.setHeader(
      "Content-Security-Policy",
      "sandbox; default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src 'self' data: https:; font-src data: https:;"
    );
    return;
  }

  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'; object-src 'none'");
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
