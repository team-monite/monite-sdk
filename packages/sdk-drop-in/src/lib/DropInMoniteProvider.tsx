import { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { MoniteProvider, MoniteSettings } from '@monite/sdk-react';

import { enhanceComponentSettings } from './MoniteEvents';

type DropInMoniteProvider = {
  sdkConfig: MoniteSettings;
  children: ReactNode;
} & Pick<
  ComponentProps<typeof MoniteProvider>,
  'locale' | 'theme' | 'componentSettings'
>;

export const DropInMoniteProvider = ({
  children,
  theme,
  componentSettings,
  locale,
  sdkConfig: { entityId, apiUrl, fetchToken, partnerId, projectId },
}: DropInMoniteProvider) => {
  const fetchTokenLatest = useLatest(fetchToken);

  const monite = useMemo(
    () => ({
      entityId,
      apiUrl,
      partnerId,
      projectId,
      fetchToken: () => fetchTokenLatest.current(),
    }),
    [apiUrl, entityId, partnerId, projectId, fetchTokenLatest]
  );

  const enhancedComponentSettings = useMemo(() => {
    return enhanceComponentSettings(componentSettings);
  }, [componentSettings]);

  return (
    <MoniteProvider
      monite={monite}
      locale={locale}
      theme={theme}
      componentSettings={enhancedComponentSettings}
    >
      {children}
    </MoniteProvider>
  );
};
