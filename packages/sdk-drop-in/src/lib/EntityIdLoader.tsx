import { createContext, ReactNode, useMemo } from 'react';

import { createAPIClient } from '@monite/sdk-react';
import {
  createSecureRequestFn,
  type QraftContextValue,
} from '@openapi-qraft/react';
import { QueryClient } from '@tanstack/react-query';

type EntityIdLoaderBaseProps = {
  apiUrl: string;
  fetchToken: () => Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>;
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
      <EntityIdLoaderRenderCallback>{children}</EntityIdLoaderRenderCallback>
    </EntityIdLoaderProvider>
  );
};

const EntityIdLoaderProvider = ({
  children,
  apiUrl,
  fetchToken,
}: EntityIdLoaderBaseProps & { children: ReactNode }) => {
  const requestFn = useMemo(() => {
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
  }, [fetchToken]);

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

const EntityIdContext = createContext<QraftContextValue>(undefined);
