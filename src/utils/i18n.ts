import { setupI18n, I18n, Messages, LocaleData as LinguiLocaleData } from '@lingui/core';
import { PluralCategory } from 'make-plural';
import plurals from 'make-plural/plurals';

interface I18nConfig {
  defaultLocale: string;
  fallbackLocale: string;
  availableLocales: string[];
}

declare module '@lingui/core' {
  interface CustomLocaleData extends LinguiLocaleData {
    plurals?: (n: number | string, ord?: boolean) => PluralCategory;
  }
}

function validateMessages(messages: unknown): asserts messages is Messages {
  if (!messages || typeof messages !== 'object') {
    throw new Error('Invalid messages format: messages must be an object');
  }
  
  if (process.env.NODE_ENV === 'production' && Object.keys(messages as object).length === 0) {
    throw new Error('No i18n messages loaded in production!');
  }
}

function validateConfig(config: I18nConfig): void {
  if (!config.defaultLocale || !config.fallbackLocale || !config.availableLocales) {
    throw new Error('Invalid i18n configuration: missing required fields');
  }
  
  if (!config.availableLocales.includes(config.defaultLocale)) {
    throw new Error(`Default locale ${config.defaultLocale} is not in available locales`);
  }
  
  if (!config.availableLocales.includes(config.fallbackLocale)) {
    throw new Error(`Fallback locale ${config.fallbackLocale} is not in available locales`);
  }
}

function loadMessages(locale: string): Messages {
  try {
    const messages = require(`../locales/${locale}/messages.json`);
    validateMessages(messages);
    return messages;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Could not load messages for locale ${locale}. This might be normal during initial setup.`);
      return {};
    }
    console.error(`Failed to load i18n messages for locale ${locale}:`, e);
    throw new Error(`Failed to load i18n messages for locale ${locale}`);
  }
}

function loadPluralRule(locale: string): ((n: number | string, ord?: boolean) => PluralCategory) | undefined {
  const pluralRule = plurals[locale as keyof typeof plurals];
  if (!pluralRule && process.env.NODE_ENV === 'production') {
    console.warn(`No plural rule found for locale ${locale}`);
  }
  return pluralRule;
}

function createI18nInstance(config: I18nConfig): I18n {
  validateConfig(config);
  
  const i18n = setupI18n();
  
  config.availableLocales.forEach(locale => {
    try {
      const messages = loadMessages(locale);
      const pluralRule = loadPluralRule(locale);
      
      const localeData: LinguiLocaleData & { plurals?: (n: number | string, ord?: boolean) => PluralCategory } = {
        plurals: pluralRule,
      };
      
      i18n.loadLocaleData(locale, localeData);
      i18n.load(locale, messages);
    } catch (e) {
      console.error(`Failed to initialize locale ${locale}:`, e);
      if (process.env.NODE_ENV === 'production') {
        throw e;
      }
    }
  });
  
  i18n.activate(config.defaultLocale);
  
  return i18n;
}

const defaultConfig: I18nConfig = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  availableLocales: ['en'],
};

export const i18n = createI18nInstance(defaultConfig);

export type { I18nConfig };
export { createI18nInstance as createI18n }; 