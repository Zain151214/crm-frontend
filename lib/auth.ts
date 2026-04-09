export type UserRole = "admin" | "member";

type JwtPayload = {
  role?: unknown;
  exp?: unknown;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = payloadBase64.padEnd(
    payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
    "=",
  );

  try {
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized === "admin" || normalized === "member") {
    return normalized;
  }

  return null;
}

export function getTokenMaxAgeSeconds(exp: unknown): number | null {
  if (typeof exp !== "number") {
    return null;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const maxAge = exp - nowInSeconds;
  return maxAge > 0 ? maxAge : null;
}
