import React, { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { messages as defaultMessages } from '@/locales/en/messages.ts';
import { MoniteSDK, MoniteSDKConfig } from '@monite/sdk-api';
import { MoniteProvider } from '@monite/sdk-react';

type AppMoniteProvider = {
  sdkConfig: MoniteSDKConfig;
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const AppMoniteProvider = ({
  children,
  theme,
  locale,
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

  return (
    <MoniteProvider
      monite={monite}
      locale={{
        ...locale,
        messages: { ...defaultMessages, ...locale?.messages },
      }}
      theme={theme}
    >
      {children}
    </MoniteProvider>
  );
};

export { AppMoniteProvider };
