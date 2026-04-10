"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { CRM_API } from "@/api";
import { ListHeader, Loader, PaginationControls } from "@/components";
import { useCustomerListQueryState } from "@/lib/hooks";

const PAGE_SIZE = 10;

function MemberCustomersContent() {
  const { search, setSearch, page, setPage, debouncedSearch } = useCustomerListQueryState();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["customers", "member", page, debouncedSearch],
    queryFn: () =>
      CRM_API.listCustomers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      }),
  });

  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };
  const rows = data?.data ?? [];
  const showEmptyResults = isSuccess && rows.length === 0;

  return (
    <div className="space-y-4">
      <ListHeader
        title="Customers"
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        action={
          <Link
            href="/dashboard/member/customers/new"
            className="rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Create Customer
          </Link>
        }
      />
      {isPending ? <Loader label="Loading customers…" /> : null}
      <section className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
        {rows.map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-b-0"
          >
            <div>
              <p className="font-semibold text-zinc-900">{customer.name}</p>
              <p className="text-sm text-zinc-600">{customer.email}</p>
            </div>
            <Link
              href={`/dashboard/member/customers/${customer.id}`}
              className="text-sm font-semibold text-indigo-600"
            >
              View
            </Link>
          </div>
        ))}
        {showEmptyResults ? (
          <p className="py-6 text-center text-sm text-zinc-500">No customers match your search.</p>
        ) : null}
      </section>
      <PaginationControls page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
    </div>
  );
}

export default function MemberCustomersPage() {
  return (
    <Suspense fallback={<Loader label="Loading customers…" />}>
      <MemberCustomersContent />
    </Suspense>
  );
}
