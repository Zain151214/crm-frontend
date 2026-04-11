"use client";

import { Button } from "@/components/ui";
import { toastSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { logoutCurrentUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { roleLabel, toInitials, useLoggedInUserInfo } from "@/lib/logged-in-user";

export function UserAccountMenu() {
  const router = useRouter();
  const info = useLoggedInUserInfo();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initials = toInitials(info.name);

  const logoutMutation = useMutation({
    mutationFn: logoutCurrentUser,
    onSuccess: () => {
      toastSuccess("You have been logged out.");
      setOpen(false);
      router.push("/login");
    },
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-full cursor-pointer items-center gap-2.5 rounded-2xl border border-indigo-100 bg-white/90 py-1.5 pl-1.5 pr-2.5 shadow-sm shadow-indigo-950/5 backdrop-blur transition-colors hover:border-indigo-200 hover:bg-white"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-cyan-500 text-xs font-bold text-white shadow-sm">
          {initials}
        </span>
        <span className="min-w-0 flex-1 text-left sm:max-w-48">
          <span className="block truncate text-sm font-semibold text-zinc-900">{info.name}</span>
          <span className="hidden truncate text-xs text-zinc-500 sm:block">
            {roleLabel(info.role)}
            {info.email ? ` · ${info.email}` : ""}
          </span>
        </span>
        <svg
          className={["h-4 w-4 shrink-0 text-zinc-400 transition-transform", open ? "rotate-180" : ""].join(" ")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl ring-1 ring-black/5"
          role="menu"
        >
          <div className="flex gap-3 border-b border-zinc-100 pb-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-sm">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-zinc-900">{info.name}</p>
              <p className="text-xs font-medium text-indigo-600">{roleLabel(info.role)}</p>
              {info.email ? <p className="mt-0.5 truncate text-xs text-zinc-500">{info.email}</p> : null}
            </div>
          </div>
          <div className="pt-3">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              className="cursor-pointer justify-center bg-rose-50 text-red-800 ring-1 ring-red-200/80 hover:bg-rose-100 hover:ring-red-300/80 focus-visible:outline-red-400 disabled:cursor-not-allowed"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              {logoutMutation.isPending ? "Logging out…" : "Log out"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
