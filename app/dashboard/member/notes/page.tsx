"use client";

import Link from "next/link";
import { CRM_API } from "@/api";
import { useMemo, useState } from "react";
import { paginate } from "@/lib/pagination";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/lib/hooks";
import { ListHeader, Loader, PaginationControls } from "@/components";

const PAGE_SIZE = 10;

export default function MemberNotesPage() {
  const [customerId, setCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const debouncedCustomerSearch = useDebouncedValue(customerSearch, 300);
  const [noteSearch, setNoteSearch] = useState("");
  const debouncedNoteSearch = useDebouncedValue(noteSearch, 300);
  const [page, setPage] = useState(1);

  const {
    data: customersResult,
    isPending: customersLoading,
    isSuccess: customersSuccess,
  } = useQuery({
    queryKey: ["customers", "notes-picker", debouncedCustomerSearch],
    queryFn: () =>
      CRM_API.listCustomers({
        page: 1,
        limit: 100,
        search: debouncedCustomerSearch,
      }),
  });

  const customers = customersResult?.data ?? [];

  const {
    data: notesData,
    isPending: notesLoading,
    isSuccess: notesSuccess,
    isError: notesError,
  } = useQuery({
    queryKey: ["customer-notes", customerId],
    queryFn: () => CRM_API.listNotesForCustomer(customerId),
    enabled: Boolean(customerId),
  });

  const filteredNotes = useMemo(() => {
    const list = notesData ?? [];
    const q = debouncedNoteSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((n) => n.content.toLowerCase().includes(q));
  }, [notesData, debouncedNoteSearch]);

  const paged = useMemo(() => paginate(filteredNotes, page, PAGE_SIZE), [filteredNotes, page]);
  const totalPages = Math.max(1, paged.totalPages);

  const noteFilterActive = debouncedNoteSearch.trim().length > 0;
  const showNoCustomersMatch = customersSuccess && customers.length === 0;
  const showNotesEmpty = notesSuccess && filteredNotes.length === 0;

  const createHref = customerId
    ? `/dashboard/member/notes/new?customerId=${encodeURIComponent(customerId)}`
    : "/dashboard/member/notes/new";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-lg shadow-indigo-950/5">
        <h1 className="text-xl font-bold text-zinc-900 md:text-2xl">Notes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Choose a customer, then list or add notes (API: GET/POST /customers/:customerId/notes).
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="customer" className="block text-sm font-medium text-zinc-700">
              Customer
            </label>
            <select
              id="customer"
              className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900"
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Select a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="custSearch" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Search customers (name or email)
            </label>
            <input
              id="custSearch"
              type="search"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Filter customer list…"
              className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900"
            />
          </div>
        </div>
        {customersLoading ? (
          <Loader variant="inline" size="sm" label="Loading customers…" className="mt-2" />
        ) : showNoCustomersMatch ? (
          <p className="mt-2 text-sm text-zinc-500">No customers match your search.</p>
        ) : null}
      </div>

      <ListHeader
        title="Notes for selected customer"
        search={noteSearch}
        onSearchChange={(value) => {
          setNoteSearch(value);
          setPage(1);
        }}
        searchLabel="Search note content"
        searchPlaceholder="Filter loaded notes…"
        description={customerId ? "" : "Select a customer above to load notes."}
        action={
          <Link
            href={createHref}
            className={`rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 ${!customerId ? "pointer-events-none opacity-50" : ""}`}
          >
            Create Note
          </Link>
        }
      />

      {!customerId ? (
        <p className="text-sm text-zinc-600">Pick a customer to see notes.</p>
      ) : notesLoading ? (
        <Loader label="Loading notes…" />
      ) : notesError ? (
        <p className="text-sm text-zinc-600">Unable to load notes. See the notification for details.</p>
      ) : (
        <>
          <section className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
            {paged.items.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-b-0"
              >
                <div className="min-w-0 pr-2">
                  <p className="line-clamp-2 font-medium text-zinc-900">{note.content}</p>
                  <p className="text-xs text-zinc-500">{new Date(note.createdAt).toLocaleString()}</p>
                </div>
                <Link
                  href={`/dashboard/member/notes/${customerId}/${note.id}`}
                  className="shrink-0 text-sm font-semibold text-indigo-600"
                >
                  View
                </Link>
              </div>
            ))}
            {showNotesEmpty ? (
              <p className="py-6 text-center text-sm text-zinc-500">
                {noteFilterActive ? "No notes match your search." : "No notes for this customer."}
              </p>
            ) : null}
          </section>
          <PaginationControls
            page={paged.page}
            totalPages={totalPages}
            total={filteredNotes.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
