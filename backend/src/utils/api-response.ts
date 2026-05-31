import type { Response } from "express";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_SERVER_ERROR";

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

export function sendError(
  res: Response,
  message: string,
  code: ApiErrorCode,
  status = 500
) {
  return res.status(status).json({
    success: false,
    error: {
      message,
      code
    }
  });
}
