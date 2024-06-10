import { createContext, ReactNode } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { QraftContextValue } from '@openapi-qraft/react';
import { Unstable_QraftSecureRequestFn as QraftSecureRequestFn } from '@openapi-qraft/react';

export const MoniteQraftContext = createContext<QraftContextValue>(undefined);

export const MoniteAPIProvider = ({ children }: { children?: ReactNode }) => {
  const { queryClient, fetchToken, requestFn, baseUrl } = useMoniteContext();

  return (
    <QraftSecureRequestFn
      requestFn={requestFn}
      securitySchemes={{
        async HTTPBearer() {
          const { access_token } = await fetchToken();
          return {
            token: access_token,
            // replace with the plain JWT token when the [task](https://monite.atlassian.net/browse/DEV-11142) is done
            refreshInterval: 10 * 60_000,
          };
        },
      }}
    >
      {(securedRequestFn) => (
        <MoniteQraftContext.Provider
          value={{
            queryClient,
            baseUrl,
            requestFn: securedRequestFn,
          }}
        >
          {children}
        </MoniteQraftContext.Provider>
      )}
    </QraftSecureRequestFn>
  );
};
