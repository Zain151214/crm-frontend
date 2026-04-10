"use client";

import { CRM_API } from "@/api";
import { useParams } from "next/navigation";
import { BackLink, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";

export default function NoteDetailsPage() {
  const params = useParams<{ customerId: string; noteId: string }>();
  const { data, isPending, isError } = useQuery({
    queryKey: ["note", params.customerId, params.noteId],
    queryFn: () => CRM_API.getNoteById(params.customerId, params.noteId),
    enabled: Boolean(params.customerId && params.noteId),
  });

  if (isPending) return <Loader label="Loading note…" />;
  if (isError)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/member/notes">Back to notes</BackLink>
        <p className="text-sm text-zinc-600">Unable to load this note. See the notification for details.</p>
      </div>
    );
  if (!data)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/member/notes">Back to notes</BackLink>
        <p className="text-sm text-zinc-600">Note not found.</p>
      </div>
    );

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/member/notes">Back to notes</BackLink>
      <h1 className="text-2xl font-bold text-zinc-900">Note Details</h1>
      <p className="mt-3 text-zinc-800">{data.content}</p>
      <p className="mt-2 text-sm text-zinc-500">Customer: {data.customerId}</p>
      <p className="mt-1 text-sm text-zinc-500">Organization: {data.organizationId}</p>
      <p className="mt-1 text-sm text-zinc-500">Created by: {data.createdById}</p>
      <p className="mt-1 text-sm text-zinc-500">Created at: {new Date(data.createdAt).toLocaleString()}</p>
    </section>
  );
}
