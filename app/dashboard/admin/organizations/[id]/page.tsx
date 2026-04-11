"use client";

import Link from "next/link";
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
  if (!data) {
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/organizations" />
        <p className="text-sm text-zinc-600">Organization not found.</p>
      </div>
    );
  }

  const users = data.users ?? [];

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/organizations" />
      <h1 className="text-2xl font-bold text-zinc-900">{data.name}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Created {new Date(data.createdAt).toLocaleString()} · {users.length}{" "}
        {users.length === 1 ? "member" : "members"}
      </p>

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Members</h2>
        {users.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">No users in this organization yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white text-zinc-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/80">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/dashboard/admin/users/${user.id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{user.email}</td>
                    <td className="px-4 py-3 capitalize text-zinc-600">{user.role}</td>
                    <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
