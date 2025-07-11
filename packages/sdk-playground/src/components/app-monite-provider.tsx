import { type ComponentProps, type ReactNode, useMemo } from 'react';

import { fetchToken } from '@/services/fetch-token';
import { MoniteProvider } from '@monite/sdk-react';

type AppMoniteProvider = {
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const AppMoniteProvider = ({ children }: AppMoniteProvider) => {
  const { entityId, apiUrl } = {
    entityId: import.meta.env.VITE_MONITE_ENTITY_ID,
    apiUrl: import.meta.env.VITE_MONITE_API_URL,
  };

  const monite = useMemo(
    () => ({
      entityId,
      apiUrl,
      fetchToken: () =>
        fetchToken(apiUrl, {
          entity_user_id: import.meta.env.VITE_MONITE_ENTITY_USER_ID,
          client_id: import.meta.env.VITE_MONITE_PROJECT_CLIENT_ID,
          client_secret: import.meta.env.VITE_MONITE_PROJECT_CLIENT_SECRET,
        }),
    }),
    [apiUrl, entityId, fetchToken]
  );

  return (
    <MoniteProvider
      monite={monite}
      locale={{}}
      componentSettings={{
        receivables: {
          enableEntityBankAccount: true,
        },
      }}
    >
      {children}
    </MoniteProvider>
  );
};

export { AppMoniteProvider };
