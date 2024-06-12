'use client';

import { ReactNode, useMemo } from 'react';

import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { messages as defaultMessages } from '@/locales/en/messages';

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
