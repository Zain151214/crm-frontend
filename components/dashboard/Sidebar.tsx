"use client";

import Link from "next/link";
import { getAccessToken } from "@/lib/http";
import type { UserRole } from "@/types/auth";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { decodeClientToken } from "@/lib/client-auth";
import type { SidebarNavItem } from "@/types/components";

const adminNav: SidebarNavItem[] = [
  { label: "Organizations", href: "/dashboard/admin/organizations" },
  { label: "Users", href: "/dashboard/admin/users" },
  { label: "Customers", href: "/dashboard/admin/customers" },
  { label: "Activity Logs", href: "/dashboard/admin/activity-logs" },
];

const memberNav: SidebarNavItem[] = [
  { label: "Customers", href: "/dashboard/member/customers" },
  { label: "Notes", href: "/dashboard/member/notes" },
];

function roleFromToken(): UserRole | null {
  const token = getAccessToken();
  if (token && decodeClientToken(token)?.role === "admin") return "admin";
  if (token && decodeClientToken(token)?.role === "member") return "member";
  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const routeRole =
    pathname?.startsWith("/dashboard/admin")
      ? "admin"
      : pathname?.startsWith("/dashboard/member")
        ? "member"
        : null;

  const tokenRole = useSyncExternalStore(
    () => () => {},
    roleFromToken,
    () => null,
  );

  const role = tokenRole ?? routeRole;

  const items = role === "admin" ? adminNav : role === "member" ? memberNav : [];

  return (
    <aside className="w-full shrink-0 border-b border-indigo-100 bg-white/90 p-4 backdrop-blur md:sticky md:top-0 md:h-screen md:max-h-screen md:w-72 md:overflow-y-auto md:border-b-0 md:border-r md:self-start">
      <div className="rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 p-4 text-white shadow-lg shadow-indigo-950/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">CRM Panel</p>
        <p className="mt-1 text-xl font-bold">
          {role === "admin" ? "Admin Console" : role === "member" ? "Member Workspace" : "Dashboard"}
        </p>
      </div>
      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
