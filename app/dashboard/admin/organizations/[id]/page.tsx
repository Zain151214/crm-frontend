"use client";

import { CRM_API } from "@/api";
import { useParams } from "next/navigation";
import { BackLink, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";

export default function OrganizationDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({
    queryKey: ["organizations", params.id],
    queryFn: () => CRM_API.getOrganizationById(params.id),
  });

  if (isPending) return <Loader label="Loading organization…" />;
  if (isError)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/organizations" />
        <p className="text-sm text-zinc-600">Unable to load this organization. See the notification for details.</p>
      </div>
    );
  if (!data) return <p className="text-sm text-zinc-600">Organization not found.</p>;

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/organizations" />
      <h1 className="text-2xl font-bold text-zinc-900">{data.name}</h1>
      <p className="mt-2 text-sm text-zinc-500">ID: {data.id}</p>
      <p className="mt-1 text-sm text-zinc-500">Members: {data.memberCount}</p>
      <p className="mt-1 text-sm text-zinc-500">
        First member joined: {new Date(data.createdAt).toLocaleString()}
      </p>
    </section>
  );
}
