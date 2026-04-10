"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={5000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-indigo-100/80 bg-white text-zinc-900 shadow-lg shadow-indigo-950/10",
          title: "font-semibold",
          description: "text-zinc-600",
        },
      }}
    />
  );
}
