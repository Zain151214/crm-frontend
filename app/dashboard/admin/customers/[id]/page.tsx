"use client";

import { CRM_API } from "@/api";
import { useParams } from "next/navigation";
import { BackLink, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";

export default function AdminCustomerDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({
    queryKey: ["customers", params.id],
    queryFn: () => CRM_API.getCustomerById(params.id),
  });

  if (isPending) return <Loader label="Loading customer…" />;
  if (isError)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/customers" />
        <p className="text-sm text-zinc-600">Unable to load this customer. See the notification for details.</p>
      </div>
    );
  if (!data) return <p className="text-sm text-zinc-600">Customer not found.</p>;

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/customers" />
      <h1 className="text-2xl font-bold text-zinc-900">{data.name}</h1>
      <p className="mt-2 text-zinc-600">{data.email}</p>
      <p className="mt-1 text-sm text-zinc-500">Phone: {data.phone}</p>
      <p className="mt-1 text-sm text-zinc-500">Assigned to: {data.assignedToId ?? "Unassigned"}</p>
      <p className="mt-1 text-sm text-zinc-500">Created at: {new Date(data.createdAt).toLocaleString()}</p>
    </section>
  );
}
