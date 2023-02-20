import React, { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MoniteApp } from '@team-monite/sdk-api';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MoniteProviderStyles } from 'core/context/ContextProvider';
import MaterialThemeProvider from '../core/MaterialThemeProvider';

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
  material,
}: {
  children: ReactNode;
  client: QueryClient;
  material?: boolean;
}) => {
  if (!material) {
    return (
      <QueryClientProvider client={client}>
        <MoniteProviderStyles monite={monite}>{children}</MoniteProviderStyles>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={client}>
      <MaterialThemeProvider>{children}</MaterialThemeProvider>
    </QueryClientProvider>
  );
};

// for component testing
export function renderWithClient(
  children: ReactElement,
  material: boolean = false
) {
  const testQueryClient = createTestQueryClient();

  const { rerender, ...result } = render(
    <Provider
      client={testQueryClient}
      children={children}
      material={material}
    />
  );

  return {
    ...result,
    rerender: (children: ReactElement) =>
      rerender(
        <Provider
          client={testQueryClient}
          children={children}
          material={material}
        />
      ),
  };
}

// for hooks testing
export function createWrapper() {
  const testQueryClient = createTestQueryClient();

  return ({ children }: { children: ReactNode }) => (
    <Provider client={testQueryClient} children={children} />
  );
}
