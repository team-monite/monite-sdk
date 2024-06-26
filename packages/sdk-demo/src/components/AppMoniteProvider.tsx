import React, { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { useLingui } from '@lingui/react';
import { MoniteSDK, MoniteSDKConfig } from '@monite/sdk-api';
import { MoniteProvider } from '@monite/sdk-react';

type AppMoniteProvider = {
  sdkConfig: MoniteSDKConfig;
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const AppMoniteProvider = ({
  children,
  theme,
  sdkConfig: { headers, entityId, apiUrl, fetchToken },
}: AppMoniteProvider) => {
  const fetchTokenLatest = useLatest(fetchToken);

  const monite = useMemo(
    () =>
      new MoniteSDK({
        entityId,
        apiUrl,
        headers,
        fetchToken: (...rest) => fetchTokenLatest.current(...rest),
      }),
    [apiUrl, entityId, fetchTokenLatest, headers]
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
