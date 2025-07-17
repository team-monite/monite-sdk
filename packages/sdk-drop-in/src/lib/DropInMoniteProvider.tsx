import { type ComponentProps, type ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { MoniteProvider, type MoniteSettings } from '@monite/sdk-react';

import { enhanceComponentSettings } from './MoniteEvents';

type DropInMoniteProvider = {
  sdkConfig: MoniteSettings;
  children: ReactNode;
  onThemeMounted?: () => void;
} & Pick<
  ComponentProps<typeof MoniteProvider>,
  'locale' | 'theme' | 'componentSettings'
>;

export const DropInMoniteProvider = ({
  children,
  theme,
  componentSettings,
  locale,
  sdkConfig: { entityId, apiUrl, fetchToken },
  onThemeMounted = () => {},
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

  const enhancedComponentSettings = useMemo(() => {
    return enhanceComponentSettings(componentSettings);
  }, [componentSettings]);

  return (
    <MoniteProvider
      monite={monite}
      locale={locale}
      theme={theme}
      componentSettings={enhancedComponentSettings}
      onThemeMounted={() => {
        onThemeMounted();
      }}
    >
      {children}
    </MoniteProvider>
  );
};
