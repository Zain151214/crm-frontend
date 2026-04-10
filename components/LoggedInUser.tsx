"use client";

import type { UserRole } from "@/types/auth";
import { useSyncExternalStore } from "react";
import { decodeClientToken } from "@/lib/client-auth";
import { getAccessToken } from "@/lib/http";

type UserInfo = { name: string; email: string; role: UserRole | null };

const FALLBACK_USER_INFO: UserInfo = { name: "User", email: "", role: null };
let cachedToken: string | null | undefined;
let cachedUserInfo: UserInfo = FALLBACK_USER_INFO;

function toTitleCase(value: string): string {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function toInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function roleLabel(role: UserRole | null): string {
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return "User";
}

function readUserInfo(): UserInfo {
  const token = getAccessToken();
  if (token === cachedToken) return cachedUserInfo;

  cachedToken = token;
  if (!token) {
    cachedUserInfo = FALLBACK_USER_INFO;
    return cachedUserInfo;
  }

  const payload = decodeClientToken(token);
  if (!payload) {
    cachedUserInfo = FALLBACK_USER_INFO;
    return cachedUserInfo;
  }

  let name = "User";
  if (payload.email && payload.email.trim()) {
    const local = payload.email.split("@")[0] ?? "";
    name = toTitleCase(local || "User");
  }
  if (payload.name && payload.name.trim()) {
    name = payload.name.trim();
  }

  const email = payload.email?.trim() ?? "";
  const role = payload.role === "admin" || payload.role === "member" ? payload.role : null;
  cachedUserInfo = { name, email, role };
  return cachedUserInfo;
}

export function LoggedInUser() {
  const info = useSyncExternalStore(
    () => () => {},
    readUserInfo,
    () => FALLBACK_USER_INFO,
  );
  const initials = toInitials(info.name);

  return (
    <div className="w-full rounded-2xl border border-indigo-100 bg-white/90 p-2 shadow-sm shadow-indigo-950/5 backdrop-blur sm:w-auto">
      <div className="flex items-center gap-2.5">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-cyan-500 text-xs font-bold text-white shadow-sm">
          {initials}
        </div>
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-semibold text-zinc-900 text-start">{info.name}</p>
          <p className="truncate text-xs text-zinc-500">
            {roleLabel(info.role)}
            {info.email ? ` · ${info.email}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
