import { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { MoniteProvider, MoniteSettings } from '@monite/sdk-react';

type DropInMoniteProvider = {
  sdkConfig: MoniteSettings;
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

export const DropInMoniteProvider = ({
  children,
  theme,
  locale,
  sdkConfig: { headers, entityId, apiUrl, fetchToken },
}: DropInMoniteProvider) => {
  const fetchTokenLatest = useLatest(fetchToken);

  const monite = useMemo(
    () => ({
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
