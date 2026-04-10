import { ACCESS_TOKEN_COOKIE, getCookie } from "@/lib/cookies";
import type { ApiErrorBody, HttpJsonRequestOptions } from "@/types/http";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;

export type { ApiErrorBody } from "@/types/http";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function formatApiMessage(body: ApiErrorBody): string {
  const m = body.message;
  if (Array.isArray(m)) return m.join(", ");
  if (typeof m === "string") return m;
  return body.error ?? "Request failed";
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

export async function apiRequest<T>(
  path: string,
  options: HttpJsonRequestOptions = {},
): Promise<T> {
  const token = getAccessToken();
  const { json, body: initBody, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : initBody,
  });

  const data = (await parseJson(response)) as ApiErrorBody & Record<string, unknown>;

  if (!response.ok) {
    throw new Error(formatApiMessage(data));
  }

  return data as T;
}
