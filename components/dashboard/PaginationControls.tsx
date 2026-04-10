"use client";

import { Button } from "@/components/ui";
import type { PaginationControlsProps } from "@/types/components";

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
      <p className="text-sm font-medium text-zinc-600">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
