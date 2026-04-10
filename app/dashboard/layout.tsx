"use client";

import { LoggedInUser, LogoutButton, Sidebar } from "@/components";
import type { DashboardLayoutProps } from "@/types/components";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-50 md:flex md:items-start">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-col items-end gap-2">
            <LoggedInUser />
            <LogoutButton />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
