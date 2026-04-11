import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookies";
import { decodeClientToken, isStoredTokenValid } from "@/lib/client-auth";
import { homeUrlForRole, normalizeRole } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const payload = token ? decodeClientToken(token) : null;
  const role = normalizeRole(payload?.role);
  const isLoggedIn = Boolean(token && isStoredTokenValid(token) && role);

  const isLoginRoute = pathname === "/login";
  const isDashboardRoute = pathname.startsWith("/dashboard/");

  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isLoginRoute && role) {
    return NextResponse.redirect(homeUrlForRole(role, request));
  }

  if (isLoggedIn && isDashboardRoute && role) {
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(homeUrlForRole(role, request));
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/member/customers", request.url));
    }
    if (pathname.startsWith("/dashboard/member") && role !== "member") {
      return NextResponse.redirect(homeUrlForRole(role, request));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard", "/dashboard/:path*"],
};