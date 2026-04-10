"use client";

import { CRM_API } from "@/api";
import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { ListHeader, Loader, PaginationControls } from "@/components";

const PAGE_SIZE = 10;

function formatEntityTypeLabel(type: string): string {
  if (!type) return "Entity";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search, 350);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["activityLogs", page],
    queryFn: () =>
      CRM_API.listActivityLogs({
        page,
        limit: PAGE_SIZE,
      }),
  });

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    const rows = data?.data ?? [];
    if (!q) return rows;
    return rows.filter(
      (log) =>
        log.entityType.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.performedByName?.toLowerCase().includes(q) ?? false) ||
        (log.performedBy?.toLowerCase().includes(q) ?? false) ||
        (log.entityName?.toLowerCase().includes(q) ?? false),
    );
  }, [data?.data, debounced]);

  const meta = data?.meta ?? { page: 1, totalPages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <ListHeader
        title="Activity Logs"
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchLabel="Filter this page (type, action, performer name, entity name)"
      />
      {isPending ? <Loader label="Loading activity…" /> : null}
      <section className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg shadow-indigo-950/5">
        {filtered.map((log) => (
          <div key={log.id} className="border-b border-zinc-100 py-3 last:border-b-0">
            <p className="font-medium text-zinc-900">
              {log.entityType} · {log.action}
            </p>
            {log.entityName?.trim() ? (
              <p className="text-sm text-zinc-600">
                {formatEntityTypeLabel(log.entityType)}: {log.entityName.trim()}
              </p>
            ) : null}
            <p className="text-xs text-zinc-500">
              By {log.performedByName?.trim() || log.performedBy?.trim() || "—"} at{" "}
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
        {isSuccess && filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">No entries on this page match the filter.</p>
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
