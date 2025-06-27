import { ReactNode, useEffect } from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { messages as enMessages } from '../locales/en/messages.mjs';

// Initialize with English locale synchronously to prevent null rendering
i18n.load('en', enMessages);
i18n.activate('en');

const getLanguageCode = (locale: string): string => {
  return locale.split('-')[0] || 'en';
};

export const SDKDemoI18nProvider = ({
  children,
  localeCode,
}: {
  children: ReactNode;
  localeCode: string;
}) => {
  useEffect(() => {
    const loadMessages = async () => {
      const languageCode = getLanguageCode(localeCode);

      if (i18n.locale === languageCode || languageCode === 'en') return;

      try {
        const catalog = await import(`../locales/${languageCode}/messages.mjs`);

        i18n.load(languageCode, catalog.messages);
        i18n.activate(languageCode);
      } catch (error) {
        console.error(
          `Failed to load locale: ${languageCode}, falling back to English`,
          error
        );
        i18n.activate('en');
      }
    };

    if (localeCode) {
      loadMessages();
    }
  }, [localeCode]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
