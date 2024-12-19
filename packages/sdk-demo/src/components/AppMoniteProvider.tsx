import { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { useLingui } from '@lingui/react';
import { MoniteProvider, MoniteSettings } from '@monite/sdk-react';

type AppMoniteProvider = {
  sdkConfig: MoniteSettings;
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const AppMoniteProvider = ({
  children,
  theme,
  sdkConfig: { entityId, apiUrl, fetchToken },
}: AppMoniteProvider) => {
  const fetchTokenLatest = useLatest(fetchToken);

  const monite = useMemo(
    () => ({
      entityId,
      apiUrl,
      fetchToken: () => fetchTokenLatest.current(),
    }),
    [apiUrl, entityId, fetchTokenLatest]
  );

  const { i18n } = useLingui();

  return (
    <MoniteProvider
      monite={monite}
      locale={{
        code: i18n.locale,
        messages: i18n.messages[i18n.locale],
      }}
      theme={theme}
    >
      {children}
    </MoniteProvider>
  );
};

export { AppMoniteProvider };
