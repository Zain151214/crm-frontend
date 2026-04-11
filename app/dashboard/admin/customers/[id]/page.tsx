"use client";

import { CRM_API } from "@/api";
import { Button } from "@/components/ui";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getErrorMessage, toastSuccess } from "@/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BackLink, ConfirmDialog, CustomerDetailSummary, EditCustomerDialog, Loader } from "@/components";

export default function AdminCustomerDetailsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [assignUsersRequested, setAssignUsersRequested] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailSuppressedForCustomerId, setDetailSuppressedForCustomerId] = useState<string | null>(null);
  const suppressCustomerDetailQuery =
    Boolean(params.id) && detailSuppressedForCustomerId === params.id;

  const { data, isPending, isError } = useQuery({
    queryKey: ["customers", params.id],
    queryFn: () => CRM_API.getCustomerById(params.id),
    enabled: Boolean(params.id) && !suppressCustomerDetailQuery,
  });

  const showAssignControls =
    data != null &&
    !data.deletedAt &&
    (data.assignedToId == null || data.assignedToId === "");

  const {
    data: usersResult,
    isPending: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["users", "assign-options"],
    queryFn: () => CRM_API.listUsers({ page: 1, limit: 100, search: "" }),
    enabled: showAssignControls && assignUsersRequested,
  });

  const users = usersResult?.data ?? [];

  const assignMutation = useMutation({
    mutationFn: (userId: string) => CRM_API.assignCustomer(params.id, { userId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toastSuccess("Customer assigned successfully.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: { name: string; phone: string }) =>
      CRM_API.updateCustomer(params.id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers", params.id] });
      setEditDialogOpen(false);
      toastSuccess("Customer updated successfully.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => CRM_API.deleteCustomer(params.id),
    onSuccess: async () => {
      flushSync(() => {
        setDetailSuppressedForCustomerId(params.id);
      });
      queryClient.cancelQueries({ queryKey: ["customers", params.id] });
      queryClient.removeQueries({ queryKey: ["customers", params.id] });
      await queryClient.invalidateQueries({ queryKey: ["customers", "admin"] });
      toastSuccess("Customer deleted successfully.");
      router.push("/dashboard/admin/customers");
    },
  });

  if (suppressCustomerDetailQuery) {
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/customers" />
        <Loader variant="inline" label="Redirecting…" />
      </div>
    );
  }

  if (isPending) return <Loader label="Loading customer…" />;
  if (isError)
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/customers" />
        <p className="text-sm text-zinc-600">Unable to load this customer. See the notification for details.</p>
      </div>
    );
  if (!data) {
    return (
      <div className="space-y-3">
        <BackLink href="/dashboard/admin/customers" />
        <p className="text-sm text-zinc-600">Customer not found.</p>
      </div>
    );
  }
  const onAssign = () => {
    if (!selectedUserId) return;
    assignMutation.mutate(selectedUserId);
  };

  const onDelete = () => {
    setDeleteDialogOpen(false);
    deleteMutation.mutate();
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <BackLink href="/dashboard/admin/customers" />
      <h1 className="text-2xl font-bold text-zinc-900">{data.name}</h1>
      <CustomerDetailSummary data={data} />
      <div className="mt-8 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-800">Actions</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {!data.deletedAt ? (
            <Button type="button" variant="ghost" onClick={() => setEditDialogOpen(true)}>
              Edit
            </Button>
          ) : null}
          {showAssignControls ? (
            <>
              <select
                className="h-11 min-w-56 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                onFocus={() => {
                  if (!assignUsersRequested) setAssignUsersRequested(true);
                }}
                disabled={assignUsersRequested && usersLoading}
                aria-label="Assign customer to user"
              >
                {!assignUsersRequested ? (
                  <option value="">Open to load users…</option>
                ) : null}
                {assignUsersRequested && usersLoading ? <option value="">Loading users…</option> : null}
                {assignUsersRequested && usersError ? <option value="">Unable to load users</option> : null}
                {assignUsersRequested && !usersLoading && !usersError ? (
                  <option value="">
                    {users.length > 0 ? "Select user to assign" : "No users available"}
                  </option>
                ) : null}
                {assignUsersRequested && !usersLoading && !usersError
                  ? users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))
                  : null}
              </select>
              <Button
                type="button"
                onClick={onAssign}
                disabled={!selectedUserId || assignMutation.isPending}
              >
                {assignMutation.isPending ? "Assigning..." : "Assign to user"}
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="text-red-700 ring-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
        {showAssignControls && assignMutation.isError ? (
          <p className="text-xs text-red-600">
            {getErrorMessage(assignMutation.error, "Unable to assign customer.")}
          </p>
        ) : null}
        {deleteMutation.isError ? (
          <p className="text-xs text-red-600">
            {getErrorMessage(deleteMutation.error, "Unable to delete customer.")}
          </p>
        ) : null}
        {updateMutation.isError ? (
          <p className="text-xs text-red-600">
            {getErrorMessage(updateMutation.error, "Unable to update customer.")}
          </p>
        ) : null}
      </div>
      <EditCustomerDialog
        key={editDialogOpen ? `edit-${data.id}` : `edit-${data.id}-closed`}
        open={editDialogOpen}
        email={data.email}
        initialName={data.name}
        initialPhone={data.phone}
        loading={updateMutation.isPending}
        onCancel={() => setEditDialogOpen(false)}
        onSave={(values) => updateMutation.mutate(values)}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Customer?"
        description={`This will be ${data.name}. You can restore later, but this customer will be removed from active lists now.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={onDelete}
      />
    </section>
  );
}
