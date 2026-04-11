"use client";

import Link from "next/link";
import { CRM_API } from "@/api";
import { BackLink } from "@/components";
import { toastSuccess } from "@/lib/toast";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ORG_PAGE_SIZE = 500;

export default function CreateUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: orgsResult, isPending: orgsLoading, isError: orgsError } = useQuery({
    queryKey: ["organizations", "create-user-dropdown"],
    queryFn: () => CRM_API.listOrganizations({ page: 1, limit: ORG_PAGE_SIZE, search: "" }),
  });

  const organizations = orgsResult?.data ?? [];

  const createMutation = useMutation({
    mutationFn: CRM_API.createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toastSuccess("User created successfully.");
      router.push("/dashboard/admin/users");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organizationId) return;
    createMutation.mutate({
      name,
      email,
      password,
      role: "member",
      organizationId,
    });
  };

  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/users" />
      <h1 className="mt-2 text-2xl font-bold text-zinc-900">Create User</h1>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="organizationId" className="block text-sm font-medium text-zinc-700">
            Organization <span className="text-red-600">*</span>
          </label>
          <select
            id="organizationId"
            className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-shadow focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
            disabled={orgsLoading || orgsError}
          >
            {orgsLoading ? <option value="">Loading organizations…</option> : null}
            {orgsError ? <option value="">Unable to load organizations</option> : null}
            {!orgsLoading && !orgsError ? (
              <option value="">
                {organizations.length > 0 ? "Select an organization" : "No organizations yet"}
              </option>
            ) : null}
            {!orgsLoading && !orgsError
              ? organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))
              : null}
          </select>
          {!orgsLoading && !orgsError && organizations.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Create an organization first.{" "}
              <Link href="/dashboard/admin/organizations/new" className="font-semibold text-indigo-600 hover:underline">
                New organization
              </Link>
            </p>
          ) : null}
        </div>
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          }
        />
        <Button
          type="submit"
          disabled={createMutation.isPending || orgsLoading || orgsError || organizations.length === 0}
        >
          {createMutation.isPending ? "Creating..." : "Create User"}
        </Button>
      </form>
    </section>
  );
}
