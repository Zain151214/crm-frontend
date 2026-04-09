"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components";
import { decodeClientToken, isStoredTokenValid } from "@/lib/client-auth";

export default function DashboardPage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const payload = token ? decodeClientToken(token) : null;
  const role = payload?.role === "admin" || payload?.role === "member" ? payload.role : null;
  const isAuthorized = Boolean(token && isStoredTokenValid(token) && role);

  useEffect(() => {
    if (!isAuthorized) {
      router.replace("/login");
    }
  }, [isAuthorized, router]);

  if (!isAuthorized) return null;

  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-zinc-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <p className="text-sm font-medium text-indigo-600">
            {isAdmin ? "Admin Dashboard" : "CRM Dashboard"}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-900">
            {isAdmin ? "Admin Dashboard" : "User Logged In"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            You are logged in successfully.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">Total Leads</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">1,248</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">New This Week</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">92</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">Won Deals</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">37</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">Revenue</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">$84,300</p>
          </article>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Activity</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li>Sarah Johnson moved from Lead to Qualified.</li>
            <li>Enterprise account meeting scheduled for tomorrow.</li>
            <li>Follow-up reminder set for 12 high-priority contacts.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
