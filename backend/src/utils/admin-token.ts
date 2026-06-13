import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

type AdminTokenPayload = {
  sub: string;
  role: "admin";
  exp: number;
};

type AdminTokenHeader = {
  alg: "HS256";
  typ: "JWT";
};

function encode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function sign(value: string) {
  return createHmac("sha256", env.ADMIN_SESSION_SECRET).update(value).digest("base64url");
}

export function createAdminToken(username: string) {
  const header = encode({ alg: "HS256", typ: "JWT" } satisfies AdminTokenHeader);
  const payload = encode({
    sub: username,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8
  } satisfies AdminTokenPayload);
  const unsigned = `${header}.${payload}`;

  return `${unsigned}.${sign(unsigned)}`;
}

export function verifyAdminToken(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;

  if (!header || !payload || !signature) {
    return null;
  }

  const decodedHeader = decode<AdminTokenHeader>(header);

  if (!decodedHeader || decodedHeader.alg !== "HS256" || decodedHeader.typ !== "JWT") {
    return null;
  }

  const unsigned = `${header}.${payload}`;
  const expected = sign(unsigned);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  const decoded = decode<AdminTokenPayload>(payload);

  if (
    !decoded ||
    typeof decoded.sub !== "string" ||
    decoded.role !== "admin" ||
    !Number.isFinite(decoded.exp) ||
    decoded.exp < Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  return decoded;
}
