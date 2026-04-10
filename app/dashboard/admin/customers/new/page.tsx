"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CRM_API } from "@/api";
import { BackLink } from "@/components";
import { Button, Input } from "@/components/ui";
import { toastSuccess } from "@/lib/toast";

export default function CreateAdminCustomerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const createMutation = useMutation({
    mutationFn: CRM_API.createCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toastSuccess("Customer created successfully.");
      router.push("/dashboard/admin/customers");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate({ name, email, phone });
  };

  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <h1 className="text-2xl font-bold text-zinc-900">Create Customer</h1>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <BackLink href="/dashboard/admin/customers" flush />
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
          id="phone"
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          minLength={7}
        />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create Customer"}
        </Button>
      </form>
    </section>
  );
}
