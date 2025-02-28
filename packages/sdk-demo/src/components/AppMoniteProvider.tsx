import { ComponentProps, ReactNode, useMemo } from 'react';
import { useLatest } from 'react-use';

import { useLingui } from '@lingui/react';
import { MoniteProvider, MoniteSettings } from '@monite/sdk-react';

import {
  ExtendedComponentSettings,
  enhanceComponentSettings,
} from '../../../sdk-drop-in/src/lib/MoniteEvents';

type AppMoniteProvider = {
  sdkConfig: MoniteSettings;
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const defaultComponentSettings: ExtendedComponentSettings = {
  events: {
    enabled: true,
  },
};

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

  const enhancedComponentSettings = useMemo(() => {
    console.log('[AppMoniteProvider] Enhancing component settings...');
    const enhanced = enhanceComponentSettings(defaultComponentSettings);
    console.log('[AppMoniteProvider] Enhanced settings:', enhanced);
    return enhanced;
  }, []);

  return (
    <MoniteProvider
      monite={monite}
      locale={{
        code: i18n.locale,
        messages: i18n.messages[i18n.locale],
      }}
      theme={theme}
      /* @ts-expect-error - Update componentSettings types */
      componentSettings={enhancedComponentSettings}
    >
      {children}
    </MoniteProvider>
  );
};

export { AppMoniteProvider };
