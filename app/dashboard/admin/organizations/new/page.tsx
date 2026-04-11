"use client";

import { CRM_API } from "@/api";
import { BackLink } from "@/components";
import { toastSuccess } from "@/lib/toast";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const createMutation = useMutation({
    mutationFn: CRM_API.createOrganization,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toastSuccess("Organization created successfully.");
      router.push("/dashboard/admin/organizations");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate({ name });
  };

  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/organizations" />
      <h1 className="mt-2 text-2xl font-bold text-zinc-900">Create organization</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Organization names must be unique. Members and customers belong to this organization.
      </p>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <Input
          id="org-name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={1}
          autoComplete="organization"
          placeholder="Acme Inc."
        />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating…" : "Create organization"}
        </Button>
      </form>
    </section>
  );
}
