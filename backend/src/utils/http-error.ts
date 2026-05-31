import type { ApiErrorCode } from "./api-response.js";

export class HttpError extends Error {
  status: number;
  code: ApiErrorCode;

  constructor(message: string, status: number, code: ApiErrorCode) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
