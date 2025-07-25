'use client';

import { messages as defaultMessages } from '@/locales/en/messages';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { ReactNode, useMemo } from 'react';

export const RootI18nProvider = ({ children }: { children: ReactNode }) => {
  const i18n = useMemo(() => {
    const localeCode = 'en-US';

    return setupI18n({
      locale: localeCode,
      messages: { [localeCode]: defaultMessages },
    });
  }, []);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
