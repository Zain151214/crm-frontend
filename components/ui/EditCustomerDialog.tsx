"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type EditCustomerDialogProps = {
  open: boolean;
  email: string;
  initialName: string;
  initialPhone: string;
  loading?: boolean;
  onCancel: () => void;
  onSave: (values: { name: string; phone: string }) => void;
};

export function EditCustomerDialog({
  open,
  email,
  initialName,
  initialPhone,
  loading = false,
  onCancel,
  onSave,
}: EditCustomerDialogProps) {
   const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  if (!open) return null;

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const canSave = trimmedName.length > 0 && trimmedPhone.length > 0 && !loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close edit dialog"
        className="absolute inset-0 cursor-pointer bg-zinc-950/45 backdrop-blur-[2px] disabled:cursor-not-allowed"
        onClick={onCancel}
        disabled={loading}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-6 shadow-2xl shadow-zinc-900/20">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
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
            <path d="M16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-zinc-900">Edit customer</h2>
        <p className="mt-1 text-sm text-zinc-500">Update name and phone. Email cannot be changed.</p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSave) return;
            onSave({ name: trimmedName, phone: trimmedPhone });
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="edit-customer-email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="edit-customer-email"
              type="email"
              readOnly
              value={email}
              className="block w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 outline-none"
            />
          </div>
          <Input
            id="edit-customer-name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            disabled={loading}
          />
          <Input
            id="edit-customer-phone"
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            disabled={loading}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave}>
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
