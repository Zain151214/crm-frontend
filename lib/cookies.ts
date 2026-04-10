export const ACCESS_TOKEN_COOKIE = "accessToken";

function escapeRegExp(s: string) {
  return s.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapeRegExp(name)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}