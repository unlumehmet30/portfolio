import type { Request, RequestHandler } from "express";
import { sendError } from "../utils/api-response.js";

type RateLimitOptions = {
  key?: (req: Request) => string;
  max: number;
  message?: string;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

function defaultKey(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

export function createRateLimit(options: RateLimitOptions): RequestHandler {
  const store = new Map<string, RateLimitEntry>();
  const cleanupIntervalMs = Math.max(options.windowMs, 60_000);
  const timer = setInterval(() => {
    const now = Date.now();

    for (const [key, value] of store.entries()) {
      if (value.resetAt <= now) {
        store.delete(key);
      }
    }
  }, cleanupIntervalMs);
  timer.unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = options.key?.(req) || defaultKey(req);
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + options.windowMs
      });
      next();
      return;
    }

    if (existing.count >= options.max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSeconds));
      sendError(
        res,
        options.message || "Too many requests. Please try again later.",
        "TOO_MANY_REQUESTS",
        429
      );
      return;
    }

    existing.count += 1;
    store.set(key, existing);
    next();
  };
}
