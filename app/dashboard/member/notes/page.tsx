"use client";

import Link from "next/link";
import { CRM_API } from "@/api";
import { useMemo, useState } from "react";
import { paginate } from "@/lib/pagination";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/lib/hooks";
import { ListHeader, Loader, PaginationControls } from "@/components";
import { customersAssignedToCurrentUser } from "@/lib/member-customers";

const PAGE_SIZE = 10;

export default function MemberNotesPage() {
  const [customerId, setCustomerId] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const debouncedNoteSearch = useDebouncedValue(noteSearch, 300);
  const [page, setPage] = useState(1);

  const {
    data: customersResult,
    isPending: customersLoading,
    isSuccess: customersSuccess,
  } = useQuery({
    queryKey: ["customers", "notes-picker"],
    queryFn: () =>
      CRM_API.listCustomers({
        page: 1,
        limit: 100,
        search: "",
      }),
  });

  const assignableCustomers = useMemo(() => {
    const list = customersResult?.data ?? [];
    return customersAssignedToCurrentUser(list);
  }, [customersResult]);

  const selectedCustomerId = useMemo(() => {
    if (!customerId) return "";
    return assignableCustomers.some((c) => c.id === customerId) ? customerId : "";
  }, [customerId, assignableCustomers]);

  const {
    data: notesData,
    isPending: notesLoading,
    isSuccess: notesSuccess,
    isError: notesError,
  } = useQuery({
    queryKey: ["customer-notes", selectedCustomerId, debouncedNoteSearch.trim()],
    queryFn: () =>
      CRM_API.listNotesForCustomer(selectedCustomerId, {
        search: debouncedNoteSearch.trim() || undefined,
      }),
    enabled: Boolean(selectedCustomerId),
  });

  const paged = useMemo(() => paginate(notesData ?? [], page, PAGE_SIZE), [notesData, page]);
  const totalPages = Math.max(1, paged.totalPages);

  const noteFilterActive = debouncedNoteSearch.trim().length > 0;
  const showNoCustomersMatch = customersSuccess && assignableCustomers.length === 0;
  const showNotesEmpty = notesSuccess && paged.total === 0;

  const createHref = selectedCustomerId
    ? `/dashboard/member/notes/new?customerId=${encodeURIComponent(selectedCustomerId)}`
    : "/dashboard/member/notes/new";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-lg shadow-indigo-950/5">
        <h1 className="text-xl font-bold text-zinc-900 md:text-2xl">Notes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Only customers <span className="font-medium text-zinc-700">assigned to you</span> appear here.
          Choose one to list or add notes.
        </p>
        <div className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="customer" className="block text-sm font-medium text-zinc-700">
              Customer
            </label>
            <select
              id="customer"
              className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900"
              value={selectedCustomerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Select a customer…</option>
              {assignableCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        {customersLoading ? (
          <Loader variant="inline" size="sm" label="Loading customers…" className="mt-2" />
        ) : showNoCustomersMatch ? (
          <p className="mt-2 text-sm text-zinc-500">
            You have no customers assigned to you yet, so notes are unavailable.
          </p>
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
        searchPlaceholder="Search notes…"
        description={selectedCustomerId ? "" : "Select a customer above to load notes."}
        action={
          <Link
            href={createHref}
            className={`rounded-xl bg-linear-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 ${!selectedCustomerId ? "pointer-events-none opacity-50" : ""}`}
          >
            Create Note
          </Link>
        }
      />

      {!selectedCustomerId ? (
        <p className="text-sm text-zinc-600">Pick an assigned customer to see notes.</p>
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
                  href={`/dashboard/member/notes/${selectedCustomerId}/${note.id}`}
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
            total={paged.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
