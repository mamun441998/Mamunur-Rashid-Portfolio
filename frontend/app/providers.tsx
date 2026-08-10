'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Near-real-time: reflect admin edits quickly on the public site.
            staleTime: 1000 * 10,          // treat data fresh for 10s only
            refetchOnWindowFocus: true,    // refetch when returning to the tab
            refetchOnMount: true,
            refetchInterval: 1000 * 30,    // passive live refresh every 30s
            refetchIntervalInBackground: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}