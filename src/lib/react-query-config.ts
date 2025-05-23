import { DefaultOptions, QueryClient } from '@tanstack/react-query'

// Shared TanStack Query default options
const defaultOptions: DefaultOptions = {
  queries: {
    // Retry failed requests twice before throwing an error
    retry: 2,
    // Consider data fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Do not refetch on window focus by default
    refetchOnWindowFocus: false,
  },
  mutations: {
    // Retry mutations once on failure
    retry: 1,
  },
}

// Instantiate a shared QueryClient
export const queryClient = new QueryClient({ defaultOptions })
