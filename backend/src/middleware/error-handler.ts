import { ZodError } from "zod";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { sendError } from "../utils/api-response.js";
import { HttpError } from "../utils/http-error.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  sendError(res, "Route not found", "NOT_FOUND", 404);
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    sendError(res, error.message, error.code, error.status);
    return;
  }

  if (error instanceof ZodError) {
    const issue = error.errors[0];
    const field = issue?.path.join(".");
    const message = issue ? `${field ? `${field}: ` : ""}${issue.message}` : "Invalid request";
    sendError(res, message, "VALIDATION_ERROR", 400);
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "MulterError"
  ) {
    sendError(res, "Invalid file upload request", "BAD_REQUEST", 400);
    return;
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    sendError(res, "Database request failed", "INTERNAL_SERVER_ERROR", 500);
    return;
  }

  console.error(error);
  sendError(res, "Unexpected server error", "INTERNAL_SERVER_ERROR", 500);
};
