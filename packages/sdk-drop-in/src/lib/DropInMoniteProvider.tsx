import { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { MoniteProvider, MoniteSettings } from '@monite/sdk-react';

import {
  areEventsEnabled,
  enhanceComponentSettings,
  ExtendedComponentSettings,
} from './MoniteEvents';

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

  const enhancedComponentSettings = useMemo(() => {
    if (!componentSettings) return componentSettings;

    console.log('[DropInMoniteProvider] Processing component settings...');

    if (!areEventsEnabled(componentSettings as ExtendedComponentSettings)) {
      console.log('[DropInMoniteProvider] Events are disabled');
      return componentSettings;
    }

    console.log(
      '[DropInMoniteProvider] Enhancing component settings with events...'
    );
    const enhanced = enhanceComponentSettings(
      componentSettings as ExtendedComponentSettings
    );
    console.log('[DropInMoniteProvider] Enhanced settings:', enhanced);

    return enhanced as typeof componentSettings;
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
