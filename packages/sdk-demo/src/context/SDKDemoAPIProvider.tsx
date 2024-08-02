import {
  ComponentProps,
  ContextType,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';

import { createAPIClient, MoniteAPIProvider } from '@monite/sdk-react';
import { useQueryClient } from '@tanstack/react-query';

type APIContext = ContextType<
  ComponentProps<typeof MoniteAPIProvider>['APIContext']
>;

export const SDKDemoAPIProvider = ({
  children,
  apiUrl,
  entityId,
  fetchToken,
}: {
  children: ReactNode;
  apiUrl: string;
  entityId: string | undefined;
  fetchToken: () => Promise<{
    access_token: string;
    expires_in: number;
    token_type: string;
  }>;
}) => {
  const queryClient = useQueryClient();

  const client = useMemo(
    () => createAPIClient({ context: SDKDemoQraftContext, entityId }),
    [entityId]
  );

  return (
    <MoniteAPIProvider
      apiUrl={apiUrl}
      requestFn={client.requestFn}
      fetchToken={fetchToken}
      queryClient={queryClient}
      APIContext={SDKDemoQraftContext}
    >
      <SDKDemoAPIContext.Provider value={client}>
        {children}
      </SDKDemoAPIContext.Provider>
    </MoniteAPIProvider>
  );
};

const SDKDemoQraftContext = createContext<APIContext>(undefined);
const SDKDemoAPIContext = createContext<ReturnType<typeof createAPIClient>>(
  undefined!
);

export const useSDKDemoAPI = () => {
  const value = useContext(SDKDemoAPIContext);
  if (!value) {
    throw new Error('useSDKDemoAPI must be used within a SDKDemoAPIProvider');
  }
  return value;
};
