import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

type AdminTokenPayload = {
  sub: string;
  role: "admin";
  exp: number;
};

function encode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function sign(value: string) {
  return createHmac("sha256", env.ADMIN_SESSION_SECRET).update(value).digest("base64url");
}

export function createAdminToken(username: string) {
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    sub: username,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8
  } satisfies AdminTokenPayload);
  const unsigned = `${header}.${payload}`;

  return `${unsigned}.${sign(unsigned)}`;
}

export function verifyAdminToken(token: string) {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
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

  if (decoded.role !== "admin" || decoded.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return decoded;
}
