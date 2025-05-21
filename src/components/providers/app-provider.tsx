"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { Toaster } from "sonner";

import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

interface AppProviderProps {
  children: React.ReactNode;
}

// Make QueryClient accessible for debugging
let queryClientInstance: QueryClient;

export function getQueryClient() {
  return queryClientInstance;
}

export function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = React.useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
      logger: {
        log: (message) => {
          console.log("React Query: ", message);
        },
        warn: (message) => {
          console.warn("React Query: ", message);
        },
        error: (error) => {
          console.error("React Query Error: ", error);
        },
      },
    });

    // Store reference for debugging
    queryClientInstance = client;
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
