import { fetchToken } from '@/services/fetch-token';
import { getLoginEnvData } from '@/services/login-env-data';
import { MoniteProvider } from '@monite/sdk-react';
import { type ComponentProps, type ReactNode, useMemo } from 'react';

type AppMoniteProvider = {
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const AppMoniteProvider = ({ children }: AppMoniteProvider) => {
  const { entityId, entityUserId, clientId, clientSecret, apiUrl } =
    getLoginEnvData();

  const monite = useMemo(
    () => ({
      entityId,
      apiUrl,
      fetchToken: () =>
        fetchToken(apiUrl, {
          entity_user_id: entityUserId,
          client_id: clientId,
          client_secret: clientSecret,
        }),
    }),
    [apiUrl, entityId, entityUserId, clientId, clientSecret]
  );

  return (
    <MoniteProvider
      monite={monite}
      locale={{}}
      componentSettings={{
        receivables: {
          enableEntityBankAccount: true,
        },
        payables: {
          hideAddDiscountButton: true,
          hideAddBankAccountButton: true,
        },
      }}
    >
      {children}
    </MoniteProvider>
  );
};

export { AppMoniteProvider };
