import { ReactNode, useEffect } from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

const loadEmptyFallback = () => {
  i18n.load('en', {});
  i18n.activate('en');
};

const tryLoadCatalog = async (locale: string) => {
  try {
    return await import(`../locales/${locale}/messages.mjs`);
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return null;
  }
};

async function loadMessages(locale: string) {
  let catalog = await tryLoadCatalog(locale);
  let actualLocale = locale;

  if (!catalog && locale !== 'en') {
    catalog = await tryLoadCatalog('en');
    actualLocale = 'en';
  }

  if (!catalog) {
    loadEmptyFallback();
    return;
  }

  i18n.load(actualLocale, catalog.messages);
  i18n.activate(actualLocale);
}

export const SDKDemoI18nProvider = ({
  children,
  localeCode,
}: {
  children: ReactNode;
  localeCode: string;
}) => {
  useEffect(() => {
    if (localeCode) {
      loadMessages(localeCode);
    }
  }, [localeCode]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
