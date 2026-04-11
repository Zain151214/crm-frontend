"use client";

import { roleLabel, toInitials, useLoggedInUserInfo } from "@/lib/logged-in-user";

export function LoggedInUser() {
  const info = useLoggedInUserInfo();
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
