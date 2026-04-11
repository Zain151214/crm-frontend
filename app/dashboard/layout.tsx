"use client";

import { Sidebar, UserAccountMenu } from "@/components";
import type { DashboardLayoutProps } from "@/types/components";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-50 md:flex md:items-start">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex justify-end">
            <UserAccountMenu />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
