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
        <BackLink href="/dashboard/member/notes">Back</BackLink>
        <p className="text-sm text-zinc-600">Unable to load this note. See the notification for details.</p>
      </div>
    );
  if (!data)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/member/notes">Back</BackLink>
        <p className="text-sm text-zinc-600">Note not found.</p>
      </div>
    );

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/member/notes">Back</BackLink>
      <h1 className="text-2xl font-bold text-zinc-900">Note</h1>
      <p className="mt-3 whitespace-pre-wrap text-zinc-800">{data.content}</p>
      <dl className="mt-6 space-y-2 border-t border-zinc-100 pt-6 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="font-medium text-zinc-500">Customer</dt>
          <dd className="text-zinc-900">{data.customerName}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="font-medium text-zinc-500">Organization</dt>
          <dd className="text-zinc-900">{data.organizationName}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="font-medium text-zinc-500">Created by</dt>
          <dd className="text-zinc-900">{data.createdByName}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="font-medium text-zinc-500">Created at</dt>
          <dd className="text-zinc-900">{new Date(data.createdAt).toLocaleString()}</dd>
        </div>
      </dl>
    </section>
  );
}
