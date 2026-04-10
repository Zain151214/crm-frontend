"use client";

import { CRM_API } from "@/api";
import { Loader } from "@/components";
import { Button, Input } from "@/components/ui";
import { Suspense, FormEvent, useState } from "react";
import { toastSuccess, toastWarning } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function CreateNoteForm({ initialCustomerId }: { initialCustomerId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [content, setContent] = useState("");

  const { data: customersResult } = useQuery({
    queryKey: ["customers", "for-note-form"],
    queryFn: () => CRM_API.listCustomers({ page: 1, limit: 100, search: "" }),
  });
  const customers = customersResult?.data ?? [];

  const createMutation = useMutation({
    mutationFn: ({ cid, body }: { cid: string; body: { content: string } }) =>
      CRM_API.createNote(cid, body),
    onSuccess: async (_, vars) => {
      await queryClient.invalidateQueries({ queryKey: ["customer-notes", vars.cid] });
      toastSuccess("Note created successfully.");
      router.push("/dashboard/member/notes");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerId) {
      toastWarning("Select a customer.");
      return;
    }
    createMutation.mutate({ cid: customerId, body: { content } });
  };

  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <h1 className="text-2xl font-bold text-zinc-900">Create Note</h1>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="customerId" className="block text-sm font-medium text-zinc-700">
            Customer
          </label>
          <select
            id="customerId"
            className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>
        <Input id="content" label="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create Note"}
        </Button>
      </form>
    </section>
  );
}

function CreateNoteWithParams() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("customerId") ?? "";
  return <CreateNoteForm key={initial || "none"} initialCustomerId={initial} />;
}

export default function CreateNotePage() {
  return (
    <Suspense fallback={<Loader label="Loading form…" />}>
      <CreateNoteWithParams />
    </Suspense>
  );
}
