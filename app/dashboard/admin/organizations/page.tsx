"use client";

import Link from "next/link";
import { CRM_API } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { ListHeader, Loader } from "@/components";

export default function OrganizationsPage() {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => CRM_API.listOrganizations(),
  });

  const organizations = data ?? [];

  return (
    <div className="space-y-4">
      <ListHeader
        title="Organizations"
        search=""
        onSearchChange={() => {}}
        showSearch={false}
      />
      {isPending ? <Loader label="Loading organizations…" /> : null}
      <section className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-b-0"
          >
            <div>
              <p className="font-semibold text-zinc-900">{org.name}</p>
              <p className="text-sm text-zinc-500">
                {org.id} · {org.memberCount} members
              </p>
            </div>
            <Link
              href={`/dashboard/admin/organizations/${org.id}`}
              className="text-sm font-semibold text-indigo-600"
            >
              View
            </Link>
          </div>
        ))}
        {isSuccess && organizations.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">No organizations to show.</p>
        ) : null}
      </section>
    </div>
  );
}
