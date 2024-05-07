'use client';

import { ReactNode, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Provides the QueryClient to the Root Application's TansTack Query Hooks.
 * Does not affect the Monite SDK.
 */
export const RootQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
