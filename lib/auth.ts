import { NextRequest } from "next/server";
import type { UserRole } from "@/types/auth";

export type { UserRole } from "@/types/auth";

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

export function homeUrlForRole(role: UserRole, request: NextRequest) {
  const path =
    role === "admin" ? "/dashboard/admin/organizations" : "/dashboard/member/customers";
    
  return new URL(path, request.url);
}