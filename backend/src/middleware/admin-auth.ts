import type { RequestHandler } from "express";
import { sendError } from "../utils/api-response.js";
import { verifyAdminToken } from "../utils/admin-token.js";

export const requireAdmin: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    sendError(res, "Admin authorization token is required", "BAD_REQUEST", 401);
    return;
  }

  const payload = verifyAdminToken(token);

  if (!payload) {
    sendError(res, "Invalid or expired admin session", "BAD_REQUEST", 401);
    return;
  }

  res.locals.admin = payload;
  next();
};
