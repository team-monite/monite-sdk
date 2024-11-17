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
  sdkConfig: { entityId, apiUrl, fetchToken },
}: DropInMoniteProvider) => {
  const fetchTokenLatest = useLatest(fetchToken);

  const monite = useMemo(
    () => ({
      entityId,
      apiUrl,

      fetchToken: () => fetchTokenLatest.current(),
    }),
    [apiUrl, entityId, fetchTokenLatest]
  );

  return (
    <MoniteProvider monite={monite} locale={locale} theme={theme}>
      {children}
    </MoniteProvider>
  );
};
