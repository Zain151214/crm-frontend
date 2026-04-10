"use client";

import Link from "next/link";
import { Suspense } from "react";
import { CRM_API } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { ListHeader, Loader, PaginationControls } from "@/components";
import { useSearchPaginationQueryState } from "@/lib/hooks";

const PAGE_SIZE = 10;

function OrganizationsContent() {
  const { search, setSearch, page, setPage, debouncedSearch } = useSearchPaginationQueryState();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["organizations", page, debouncedSearch],
    queryFn: () =>
      CRM_API.listOrganizations({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      }),
  });

  const organizations = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <ListHeader
        title="Organizations"
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchLabel="Search organizations"
        searchPlaceholder="Type organization name..."
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
          <p className="py-6 text-center text-sm text-zinc-500">No organizations match your search.</p>
        ) : null}
      </section>
      <PaginationControls
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        onPageChange={setPage}
      />
    </div>
  );
}

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<Loader label="Loading organizations…" />}>
      <OrganizationsContent />
    </Suspense>
  );
}
