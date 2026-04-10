"use client";

import type { PaginationControlsProps } from "@/types/components";

function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const navBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold transition-all " +
  "bg-linear-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-900/20 " +
  "hover:from-indigo-500 hover:to-cyan-400 hover:shadow-lg hover:shadow-indigo-900/25 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none disabled:saturate-0";

export function PaginationControls({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-h-6">
        {typeof total === "number" ? (
          <p className="text-sm text-zinc-600">
            <span className="text-lg font-bold tabular-nums text-indigo-700">
              {total.toLocaleString()}
            </span>{" "}
            <span className="font-medium text-zinc-800">
              {total === 1 ? "item" : "items"} total
            </span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
        <p className="text-sm text-zinc-600">
          Page{" "}
          <span className="font-semibold tabular-nums text-zinc-900">{page}</span>
          <span className="text-zinc-400"> / </span>
          <span className="font-medium tabular-nums text-zinc-700">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={navBtn}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="shrink-0 opacity-90" />
            Previous
          </button>
          <button
            type="button"
            className={navBtn}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="shrink-0 opacity-90" />
          </button>
        </div>
      </div>
    </div>
  );
}
