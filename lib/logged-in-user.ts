import { useSyncExternalStore } from "react";
import type { UserRole } from "@/types/auth";
import { decodeClientToken } from "@/lib/client-auth";
import { getAccessToken } from "@/lib/http";

export type LoggedInUserInfo = { name: string; email: string; role: UserRole | null };

const FALLBACK: LoggedInUserInfo = { name: "User", email: "", role: null };
let cachedToken: string | null | undefined;
let cached: LoggedInUserInfo = FALLBACK;

function toTitleCase(value: string): string {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function readLoggedInUserInfo(): LoggedInUserInfo {
  const token = getAccessToken();
  if (token === cachedToken) return cached;

  cachedToken = token;
  if (!token) {
    cached = FALLBACK;
    return cached;
  }

  const payload = decodeClientToken(token);
  if (!payload) {
    cached = FALLBACK;
    return cached;
  }

  let name = "User";
  if (payload.email?.trim()) {
    const local = payload.email.split("@")[0] ?? "";
    name = toTitleCase(local || "User");
  }
  if (payload.name?.trim()) {
    name = payload.name.trim();
  }

  const email = payload.email?.trim() ?? "";
  const role = payload.role === "admin" || payload.role === "member" ? payload.role : null;
  cached = { name, email, role };
  return cached;
}

export function useLoggedInUserInfo(): LoggedInUserInfo {
  return useSyncExternalStore(() => () => {}, readLoggedInUserInfo, () => FALLBACK);
}

export function roleLabel(role: UserRole | null): string {
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return "User";
}

export function toInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
