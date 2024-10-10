import { Context, createContext, ReactNode } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import type { QraftContextValue } from '@openapi-qraft/react';
import { QraftSecureRequestFn } from '@openapi-qraft/react/Unstable_QraftSecureRequestFn';

export const MoniteQraftContext = createContext<QraftContextValue>(undefined);

export const MoniteAPIProvider = ({
  children,
  APIContext,
}: {
  children?: ReactNode;
  APIContext: Context<QraftContextValue>;
}) => {
  const { apiUrl, fetchToken, queryClient, requestFn } = useMoniteContext();

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
        <APIContext.Provider
          value={{
            queryClient,
            baseUrl: apiUrl,
            requestFn: securedRequestFn,
          }}
        >
          {children}
        </APIContext.Provider>
      )}
    </QraftSecureRequestFn>
  );
};
