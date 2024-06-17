import { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { MoniteSDK, MoniteSDKConfig } from '@monite/sdk-api';
import { MoniteProvider } from '@monite/sdk-react';

type CommonMoniteProvider = {
  sdkConfig: MoniteSDKConfig;
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

export const DropInMoniteProvider = ({
  children,
  theme,
  locale,
  sdkConfig: { headers, entityId, apiUrl, fetchToken },
}: CommonMoniteProvider) => {
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
    <MoniteProvider monite={monite} locale={locale} theme={theme}>
      {children}
    </MoniteProvider>
  );
};
