import React, { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MoniteApp } from '@team-monite/sdk-api';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MoniteProviderStyles } from 'core/context/ContextProvider';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const monite = new MoniteApp({
  locale: 'en',
  apiUrl: '',
  token: '',
});

const Provider = ({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) => (
  <QueryClientProvider client={client}>
    <MoniteProviderStyles monite={monite}>{children}</MoniteProviderStyles>
  </QueryClientProvider>
);

// for component testing
export function renderWithClient(children: ReactElement) {
  const testQueryClient = createTestQueryClient();

  const { rerender, ...result } = render(
    <Provider client={testQueryClient} children={children} />
  );

  return {
    ...result,
    rerender: (children: ReactElement) =>
      rerender(<Provider client={testQueryClient} children={children} />),
  };
}

// for hooks testing
export function createWrapper() {
  const testQueryClient = createTestQueryClient();

  return ({ children }: { children: ReactNode }) => (
    <Provider client={testQueryClient} children={children} />
  );
}
