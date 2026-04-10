"use client";

import { CRM_API } from "@/api";
import { useParams } from "next/navigation";
import { BackLink, CustomerDetailSummary, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";

export default function MemberCustomerDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({
    queryKey: ["member-customer", params.id],
    queryFn: () => CRM_API.getCustomerById(params.id),
  });

  if (isPending) return <Loader label="Loading customer…" />;
  if (isError)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/member/customers" />
        <p className="text-sm text-zinc-600">Unable to load this customer. See the notification for details.</p>
      </div>
    );
  if (!data) {
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/member/customers" />
        <p className="text-sm text-zinc-600">Customer not found.</p>
      </div>
    );
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/member/customers" />
      <h1 className="text-2xl font-bold text-zinc-900">{data.name}</h1>
      <CustomerDetailSummary data={data} />
    </section>
  );
}
