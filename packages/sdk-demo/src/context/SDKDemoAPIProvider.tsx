import { createContext, ReactNode, useContext, useMemo } from 'react';

import { createAPIClient } from '@monite/sdk-react';
import { QraftContextValue } from '@openapi-qraft/react';
import { QraftSecureRequestFn } from '@openapi-qraft/react/Unstable_QraftSecureRequestFn';
import { useQueryClient } from '@tanstack/react-query';

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

  const { requestFn, api, version } = useMemo(
    () => createAPIClient({ context: SDKDemoQraftContext, entityId }),
    [entityId]
  );

  return (
    <QraftSecureRequestFn
      requestFn={requestFn}
      securitySchemes={{
        HTTPBearer: async () => {
          const { access_token } = await fetchToken();
          return {
            token: access_token,
            refreshInterval: 10 * 60_000,
          };
        },
      }}
    >
      {(securedRequestFn) => (
        <SDKDemoQraftContext.Provider
          value={{
            requestFn: securedRequestFn,
            baseUrl: apiUrl,
            queryClient: queryClient,
          }}
        >
          <SDKDemoAPIContext.Provider
            value={{
              api,
              version,
              requestFn: securedRequestFn,
            }}
          >
            {children}
          </SDKDemoAPIContext.Provider>
        </SDKDemoQraftContext.Provider>
      )}
    </QraftSecureRequestFn>
  );
};

const SDKDemoQraftContext = createContext<QraftContextValue>(undefined);
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
