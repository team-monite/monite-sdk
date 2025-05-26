import { ReactNode, useMemo } from 'react';

import { messages as defaultMessages } from '@/locales/en/messages';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

export const SDKDemoI18nProvider = ({
  children,
  localeCode,
}: {
  children: ReactNode;
  localeCode: string;
}) => {
  const sdkDemoI18n = useMemo(() => {
    return setupI18n({
      locale: localeCode,
      messages: {
        [localeCode]: defaultMessages,
      },
    });
  }, [localeCode]);
  return <I18nProvider i18n={sdkDemoI18n}>{children}</I18nProvider>;
};
