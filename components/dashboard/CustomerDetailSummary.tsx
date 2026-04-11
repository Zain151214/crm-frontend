import type {Props} from "@/types/components";

export function CustomerDetailSummary({ data }: Props) {
  const notes = [...(data.notes ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="mt-6 space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Contact</h2>
          <p className="mt-2 text-zinc-700">{data.email}</p>
          <p className="mt-1 text-sm text-zinc-600">{data.phone}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Organization</h2>
          <p className="mt-2 font-medium text-zinc-900">{data.organizationName?.trim() || "—"}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Assigned to</h2>
          <p className="mt-2 font-medium text-zinc-900">
            {data.assignedToName?.trim() ||
              (data.assignedToId ? "—" : "Unassigned")}
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Record</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Created {new Date(data.createdAt).toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            Updated {new Date(data.updatedAt).toLocaleString()}
          </p>
          {data.deletedAt ? (
            <p className="mt-1 text-sm font-medium text-amber-800">
              Deleted {new Date(data.deletedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Notes
          {notes.length > 0 ? (
            <span className="ml-2 font-normal normal-case text-zinc-400">({notes.length})</span>
          ) : null}
        </h2>
        {notes.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No notes for this customer yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">By</th>
                  <th className="hidden px-4 py-3 sm:table-cell">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white text-zinc-800">
                {notes.map((note) => (
                  <tr key={note.id} className="align-top hover:bg-zinc-50/80">
                    <td className="px-4 py-3">
                      <p className="whitespace-pre-wrap font-medium text-zinc-900">{note.content}</p>
                      <p className="mt-1 text-xs text-zinc-500 sm:hidden">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{note.createdByName}</td>
                    <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                      {new Date(note.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
