import type { ApiErrorBody } from "./http";

export type UserRole = "admin" | "member";

export type ClientAuthPayload = {
  sub?: string;
  email?: string;
  role?: string;
  organizationId?: string;
  iat?: number;
  exp?: number;
};

export type AuthLoginResponseBody = ApiErrorBody & {
  accessToken?: string;
};
