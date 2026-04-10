"use client";

import { useState } from "react";
import { getErrorMessage, toastError } from "@/lib/toast";
import type { QueryProviderProps } from "@/types/components";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            toastError(getErrorMessage(error, "Unable to load data."));
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            toastError(getErrorMessage(error, "Request failed."));
          },
        }),
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
