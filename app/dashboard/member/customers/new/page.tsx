"use client";

import { CRM_API } from "@/api";
import { toastSuccess } from "@/lib/toast";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateCustomerPage() {
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
      router.push("/dashboard/member/customers");
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
        <Input
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
