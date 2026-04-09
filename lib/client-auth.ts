export type ClientAuthPayload = {
  sub?: string;
  email?: string;
  role?: string;
  organizationId?: string;
  iat?: number;
  exp?: number;
};

export function decodeClientToken(token: string): ClientAuthPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as ClientAuthPayload;
  } catch {
    return null;
  }
}

export function isStoredTokenValid(token: string): boolean {
  const payload = decodeClientToken(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowInSeconds;
}
