"use client";

import Link from "next/link";
import { CRM_API } from "@/api";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchPaginationQueryState } from "@/lib/hooks";
import { ListHeader, Loader, PaginationControls } from "@/components";

const PAGE_SIZE = 10;

function AdminUsersContent() {
  const { search, setSearch, page, setPage, debouncedSearch } = useSearchPaginationQueryState();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["users", page, debouncedSearch],
    queryFn: () =>
      CRM_API.listUsers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      }),
  });

  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };
  const rows = data?.data ?? [];

  return (
    <div className="space-y-4">
      <ListHeader
        title="Users"
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        action={
          <Link href="/dashboard/admin/users/new" className="rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
            Create User
          </Link>
        }
      />
      {isPending ? <Loader label="Loading users…" /> : null}
      <section className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
        <div className="space-y-3">
          {rows.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-3">
              <div>
                <p className="font-semibold text-zinc-900">{user.name}</p>
                <p className="text-sm text-zinc-600">{user.email}</p>
              </div>
              <Link href={`/dashboard/admin/users/${user.id}`} className="text-sm font-semibold text-indigo-600">
                View
              </Link>
            </div>
          ))}
          {isSuccess && rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No users match your search.</p>
          ) : null}
        </div>
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

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<Loader label="Loading users…" />}>
      <AdminUsersContent />
    </Suspense>
  );
}
