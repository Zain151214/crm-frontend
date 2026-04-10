"use client";

import { CRM_API } from "@/api";
import { useParams } from "next/navigation";
import { BackLink, Loader } from "@/components";
import { useQuery } from "@tanstack/react-query";

export default function UserDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({
    queryKey: ["users", params.id],
    queryFn: () => CRM_API.getUserById(params.id),
  });

  if (isPending) return <Loader label="Loading user…" />;
  if (isError)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/users" />
        <p className="text-sm text-zinc-600">Unable to load this user. See the notification for details.</p>
      </div>
    );
  if (!data) {
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/users" />
        <p className="text-sm text-zinc-600">User not found.</p>
      </div>
    );
  }

  const org = data.organization;
  const names = data.assignedCustomerNames ?? [];
  const hasAssigned = names.length > 0;

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/users" />
      <h1 className="text-2xl font-bold text-zinc-900">{data.name}</h1>
      <p className="mt-2 text-zinc-600">{data.email}</p>
      <p className="mt-1 text-sm text-zinc-500">Role: {data.role}</p>
      <p className="mt-1 text-sm text-zinc-500">
        Created at: {new Date(data.createdAt).toLocaleString()}
      </p>

      <div className="mt-6 border-t border-zinc-100 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Organization</h2>
        {org ? (
          <ul className="mt-2 space-y-1 text-sm text-zinc-700">
            <li>
              <span className="font-medium text-zinc-900">{org.name}</span>
            </li>
            {typeof org.memberCount === "number" ? (
              <li className="text-zinc-500">Members: {org.memberCount}</li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">No organization name available.</p>
        )}
      </div>

      <div className="mt-6 border-t border-zinc-100 pt-6">
        <h2 className="flex flex-wrap items-baseline gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          <span>Assigned customers</span>
          {typeof data.assignedCustomerCount === "number" ? (
            <span className="font-normal normal-case text-zinc-400">({data.assignedCustomerCount})</span>
          ) : null}
        </h2>
        {hasAssigned ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Customer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white text-zinc-800">
                {names.map((name, index) => (
                  <tr key={`${name}-${index}`} className="hover:bg-zinc-50/80">
                    <td className="px-4 py-2.5 text-zinc-500">{index + 1}</td>
                    <td className="px-4 py-2.5 font-medium">{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">No customers assigned to this user.</p>
        )}
      </div>
    </section>
  );
}
