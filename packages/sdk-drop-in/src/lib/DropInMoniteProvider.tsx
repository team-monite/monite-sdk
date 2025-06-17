import { type ComponentProps, type ReactNode, useMemo, useEffect } from 'react';
import { useLatest } from 'react-use';

import {
  MoniteProvider,
  type MoniteSettings,
  useMoniteContext,
} from '@monite/sdk-react';

import { enhanceComponentSettings } from './MoniteEvents';

type DropInMoniteProvider = {
  sdkConfig: MoniteSettings;
  children: ReactNode;
  onThemeMounted?: () => void;
  onQueryClientReady?: (queryClient: unknown) => void;
} & Pick<
  ComponentProps<typeof MoniteProvider>,
  'locale' | 'theme' | 'componentSettings'
>;

const QueryClientNotifier = ({
  onQueryClientReady,
}: {
  onQueryClientReady?: (queryClient: unknown) => void;
}) => {
  const { queryClient } = useMoniteContext();

  useEffect(() => {
    if (queryClient) {
      onQueryClientReady?.(queryClient);
    }
  }, [queryClient, onQueryClientReady]);

  return null;
};

export const DropInMoniteProvider = ({
  children,
  theme,
  componentSettings,
  locale,
  sdkConfig: { entityId, apiUrl, fetchToken },
  onThemeMounted = () => {},
  onQueryClientReady,
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
      <QueryClientNotifier onQueryClientReady={onQueryClientReady} />
      {children}
    </MoniteProvider>
  );
};
