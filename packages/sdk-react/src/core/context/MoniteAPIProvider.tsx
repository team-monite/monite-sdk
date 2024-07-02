import { Context, createContext, ReactNode } from 'react';

import { MoniteContextValue } from '@/core/context/MoniteContext';
import {
  QraftContextValue,
  Unstable_QraftSecureRequestFn as QraftSecureRequestFn,
} from '@openapi-qraft/react';

export const MoniteQraftContext = createContext<QraftContextValue>(undefined);

export const MoniteAPIProvider = ({
  children,
  fetchToken,
  apiUrl,
  requestFn,
  queryClient,
  APIContext,
}: { children?: ReactNode; APIContext: Context<QraftContextValue> } & Pick<
  MoniteContextValue,
  'apiUrl' | 'fetchToken' | 'requestFn' | 'queryClient'
>) => {
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
