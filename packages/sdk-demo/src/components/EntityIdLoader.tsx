import { Component, createContext, ReactNode, useMemo } from 'react';

import { type APISchema, createAPIClient } from '@monite/sdk-react';
import { type QraftContextValue } from '@openapi-qraft/react';
import { createSecureRequestFn } from '@openapi-qraft/react/Unstable_QraftSecureRequestFn';
import { QueryClient } from '@tanstack/react-query';

type EntityIdLoaderBaseProps = {
  apiUrl: string;
  fetchToken: () => Promise<
    APISchema.components['schemas']['AccessTokenResponse']
  >;
};

export const EntityIdLoader = ({
  children,
  fetchToken,
  apiUrl,
}: EntityIdLoaderBaseProps & {
  children: (entityId: string) => ReactNode;
}) => {
  return (
    <EntityIdLoaderProvider fetchToken={fetchToken} apiUrl={apiUrl}>
      <ErrorBoundary>
        <EntityIdLoaderRenderCallback>{children}</EntityIdLoaderRenderCallback>
      </ErrorBoundary>
    </EntityIdLoaderProvider>
  );
};

const EntityIdLoaderProvider = ({
  children,
  apiUrl,
  fetchToken,
}: EntityIdLoaderBaseProps & { children: ReactNode }) => {
  const requestFn = useMemo(
    () => createEntityUsersMyEntityRequestFn(fetchToken),
    [fetchToken]
  );

  return (
    <EntityIdContext.Provider
      value={{
        requestFn,
        baseUrl: apiUrl,
      }}
    >
      {children}
    </EntityIdContext.Provider>
  );
};

const EntityIdLoaderRenderCallback = ({
  children,
}: {
  children: (entityId: string) => ReactNode;
}) => {
  const { api } = createAPIClient({ context: EntityIdContext });
  const getEntityUsersMeQuery =
    api.entityUsers.getEntityUsersMyEntity.useSuspenseQuery(
      {},
      {
        // Keep entity user data in cache indefinitely,
        // as it's unlikely to change during iframe app lifecycle.
        staleTime: Infinity,
        gcTime: Infinity,
      }
    );

  return <>{children(getEntityUsersMeQuery.data.id)}</>;
};

export const createEntityUsersMyEntityRequestFn = (
  fetchToken: EntityIdLoaderBaseProps['fetchToken']
) => {
  const { requestFn: moniteRequestFn } = createAPIClient();

  return createSecureRequestFn(
    {
      async HTTPBearer() {
        const { access_token } = await fetchToken();
        return {
          token: access_token,
          refreshInterval: Infinity,
        };
      },
    },
    moniteRequestFn,
    new QueryClient()
  );
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  {
    isError: boolean;
  }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { isError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { isError: true, error: error };
  }

  render() {
    if (this.state.isError) return null;
    return this.props.children;
  }
}

const EntityIdContext = createContext<QraftContextValue>(undefined);
