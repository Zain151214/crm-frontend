"use server";

import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookies";
import type { AuthLoginResponseBody } from "@/types/auth";
import { API_BASE_URL, formatApiMessage } from "@/lib/http";
import { getTokenCookieMaxAgeSeconds } from "@/lib/client-auth";

export async function loginWithEmailPassword(params: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });

  const data = (await response.json().catch(() => ({}))) as AuthLoginResponseBody;

  if (response.ok && typeof data.accessToken === "string" && data.accessToken.length > 0) {
    const maxAge = getTokenCookieMaxAgeSeconds(data.accessToken);
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE, data.accessToken, {
      path: "/",
      maxAge,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return {
    ok: response.ok,
    status: response.status,
    message: response.ok ? undefined : formatApiMessage(data),
  };
}

export async function logoutCurrentUser() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  return { ok: true, status: 200, message: "Logged out successfully" };
}
