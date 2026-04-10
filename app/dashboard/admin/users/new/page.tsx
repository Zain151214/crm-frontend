"use client";

import { CRM_API } from "@/api";
import { BackLink } from "@/components";
import { toastSuccess } from "@/lib/toast";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const createMutation = useMutation({
    mutationFn: CRM_API.createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toastSuccess("User created successfully.");
      router.push("/dashboard/admin/users");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate({ name, email, password, role: "member" });
  };

  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <h1 className="text-2xl font-bold text-zinc-900">Create User</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Per API: this creates a new organization from the user&apos;s name and adds the user to it.
      </p>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <BackLink href="/dashboard/admin/users" flush />
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
              className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
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
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create User"}
        </Button>
      </form>
    </section>
  );
}
