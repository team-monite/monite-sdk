import { Component, ReactNode, useMemo } from 'react';

import { type APISchema, createAPIClient } from '@monite/sdk-react';
import { QraftContext } from '@openapi-qraft/react';
import { createSecureRequestFn } from '@openapi-qraft/react/Unstable_QraftSecureRequestFn';
import { useQueryClient, QueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const requestFn = useMemo(
    () => createEntityUsersMyEntityRequestFn(fetchToken, queryClient),
    [fetchToken, queryClient]
  );

  return (
    <QraftContext.Provider
      value={{
        requestFn,
        baseUrl: apiUrl,
        queryClient: queryClient,
      }}
    >
      <ErrorBoundary>
        <EntityIdLoaderRenderCallback>{children}</EntityIdLoaderRenderCallback>
      </ErrorBoundary>
    </QraftContext.Provider>
  );
};

const EntityIdLoaderRenderCallback = ({
  children,
}: {
  children: (entityId: string) => ReactNode;
}) => {
  const { api } = createAPIClient({ context: QraftContext });

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
  fetchToken: EntityIdLoaderBaseProps['fetchToken'],
  queryClient: QueryClient
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
    queryClient
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
