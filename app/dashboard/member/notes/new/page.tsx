"use client";

import { CRM_API } from "@/api";
import { BackLink, Loader } from "@/components";
import { Button, Input } from "@/components/ui";
import { toastSuccess, toastWarning } from "@/lib/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, FormEvent, useMemo, useState } from "react";
import { customersAssignedToCurrentUser } from "@/lib/member-customers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function CreateNoteForm({ initialCustomerId }: { initialCustomerId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [content, setContent] = useState("");

  const { data: customersResult, isSuccess: customersLoaded } = useQuery({
    queryKey: ["customers", "for-note-form"],
    queryFn: () => CRM_API.listCustomers({ page: 1, limit: 100, search: "" }),
  });
  const assignable = useMemo(() => {
    const list = customersResult?.data ?? [];
    return customersAssignedToCurrentUser(list);
  }, [customersResult]);

  const selectedCustomerId = useMemo(() => {
    if (!customerId) return "";
    return assignable.some((c) => c.id === customerId) ? customerId : "";
  }, [customerId, assignable]);

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
    if (!selectedCustomerId) {
      toastWarning("Select one of your assigned customers.");
      return;
    }
    createMutation.mutate({ cid: selectedCustomerId, body: { content } });
  };

  return (
    <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/member/notes">Back</BackLink>
      <h1 className="text-2xl font-bold text-zinc-900">Create Note</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Notes are tied to the customer and your organization. You can only pick customers assigned to you.
      </p>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="customerId" className="block text-sm font-medium text-zinc-700">
            Customer (assigned to you)
            <span className="text-red-600" aria-hidden>
              {" "}
              *
            </span>
          </label>
          <select
            id="customerId"
            className="block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900"
            value={selectedCustomerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">Select a customer</option>
            {assignable.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
          {customersLoaded && assignable.length === 0 ? (
            <p className="text-sm text-zinc-500">
              You have no assigned customers yet. Ask an admin to assign customers to you.
            </p>
          ) : null}
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
