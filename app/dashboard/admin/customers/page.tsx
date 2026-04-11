"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CRM_API } from "@/api";
import { Button } from "@/components/ui";
import { ListHeader, Loader, PaginationControls } from "@/components";
import { useSearchPaginationQueryState } from "@/lib/hooks";
import { toastSuccess } from "@/lib/toast";

const PAGE_SIZE = 10;

function AdminCustomersContent() {
  const queryClient = useQueryClient();
  const { search, setSearch, page, setPage, debouncedSearch } = useSearchPaginationQueryState();
  const [statusFilter, setStatusFilter] = useState<"active" | "deleted">("active");

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["customers", "admin", statusFilter, page, debouncedSearch],
    queryFn: () =>
      statusFilter === "active"
        ? CRM_API.listCustomers({
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch,
          })
        : CRM_API.listDeletedCustomers({
            page,
            limit: PAGE_SIZE,
            search: debouncedSearch,
          }),
  });

  const restoreMutation = useMutation({
    mutationFn: (customerId: string) => CRM_API.restoreCustomer(customerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toastSuccess("Customer restored successfully.");
    },
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
            href="/dashboard/admin/customers/new"
            className="rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            Create Customer
          </Link>
        }
      />
      <div className="flex items-center justify-end">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
          Show
          <select
            className="h-10 rounded-xl border border-zinc-300 px-1 bg-white text-sm text-zinc-900"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "active" | "deleted");
              setPage(1);
            }}
          >
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
          </select>
        </label>
      </div>
      {isPending ? <Loader label="Loading customers…" /> : null}
      <section className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
        {rows.map((customer) => (
          <div
            key={customer.id}
            className={[
              "flex items-center justify-between border-b py-3 last:border-b-0",
              statusFilter === "deleted"
                ? "rounded-xl border-red-100 bg-red-50/60 px-3"
                : "border-zinc-100",
            ].join(" ")}
          >
            <div>
              <p className="font-semibold text-zinc-900">
                {customer.name}
                {statusFilter === "deleted" ? (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    Deleted
                  </span>
                ) : null}
              </p>
              <p className="text-sm text-zinc-600">{customer.email}</p>
              {statusFilter === "deleted" && customer.deletedAt ? (
                <p className="text-xs text-red-600">
                  Deleted at: {new Date(customer.deletedAt).toLocaleString()}
                </p>
              ) : null}
            </div>
            {statusFilter === "active" ? (
              <Link
                href={`/dashboard/admin/customers/${customer.id}`}
                className="text-sm font-semibold text-indigo-600"
              >
                View
              </Link>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="text-emerald-700 ring-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                disabled={restoreMutation.isPending}
                onClick={() => restoreMutation.mutate(customer.id)}
              >
                {restoreMutation.isPending ? "Restoring..." : "Restore"}
              </Button>
            )}
          </div>
        ))}
        {showEmptyResults ? (
          <p className="py-6 text-center text-sm text-zinc-500">
            {statusFilter === "active"
              ? "No active customers match your search."
              : "No deleted customers match your search."}
          </p>
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

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<Loader label="Loading customers…" />}>
      <AdminCustomersContent />
    </Suspense>
  );
}
