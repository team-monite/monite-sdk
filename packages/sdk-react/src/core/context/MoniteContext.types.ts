import type { CreateMoniteAPIClientResult } from '@/api/client';
import type { ComponentSettings } from '@/core/componentSettings';
import type { ThemeConfig } from '@/core/theme/types';
import type { I18n } from '@lingui/core';
import type { Theme } from '@mui/material';
import type { Hub } from '@sentry/react';
import type { QueryClient } from '@tanstack/react-query';
import type { Locale as DateFnsLocale } from 'date-fns';
import type { Messages } from '@lingui/core';
import type { ReactNode } from 'react';

/**
 * Base context value with i18n related properties
 */
export interface MoniteContextBaseValue {
  locale: MoniteLocaleWithRequired;
  i18n: I18n;
  dateFnsLocale: DateFnsLocale;
}

/**
 * Token fetching function type
 */
export type FetchToken = () => Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
}>;

/**
 * Extended MUI theme with Monite-specific palette
 */
export type MoniteTheme = Theme & {
  palette: {
    neutral: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '70': string;
      '80': string;
      '90': string;
      '95': string;
    };
    primary: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '60': string;
      '70': string;
      '80': string;
      '90': string;
      '95': string;
    };
  };
};

/**
 * Complete Monite context value
 */
export interface MoniteContextValue
  extends MoniteContextBaseValue,
    CreateMoniteAPIClientResult {
  environment: 'dev' | 'sandbox' | 'production';
  entityId: string;
  sentryHub: Hub | undefined;
  queryClient: QueryClient;
  apiUrl: string;
  theme: MoniteTheme;
  componentSettings: ComponentSettings;
  fetchToken: FetchToken;
}

/**
 * Settings for Monite provider
 */
export interface MoniteSettings {
  apiUrl?: string;
  entityId: string;
  fetchToken: FetchToken;
}

/**
 * Props for MoniteContextProvider
 */
export interface MoniteContextProviderProps {
  monite: MoniteSettings;
  locale: Partial<MoniteLocale> | undefined;
  theme: ThemeConfig | undefined;
  componentSettings: Partial<ComponentSettings> | undefined;
  children: ReactNode;
}

/**
 * Props for the inner context provider
 */
export interface ContextProviderProps extends MoniteContextBaseValue {
  monite: MoniteSettings;
  children: ReactNode;
  theme: ThemeConfig | undefined;
  componentSettings?: Partial<ComponentSettings>;
}

/**
 * Messages type for i18n
 */
export type MoniteSupportedMessages = Messages;

export type MoniteLocale = {
  /**
   * `code` responsible for internationalised Widgets language, internationalised number and currency formatting.
   * By default, it uses `navigator.language` as a fallback in MoniteProvider.
   * Intl format values are accepted and won't cause any trouble.
   *
   * E.g. 'en-GB', 'de-DE', etc.
   */
  code?: string;

  /**
   * `messages` responsible for internationalised Widgets translation.
   * By default, it uses `enLocaleMessages` as a fallback in MoniteProvider.
   *
   * The message object is a key-value pair where the key is the Message ID,
   * and the value is the message string or a `LinguiContextMessage` object.
   *
   * If you need to use context (`msgctxt`) for differentiating messages with the same ID,
   * you can use the LinguiContextMessage object.
   *
   * @example Without context:
   * ```ts
   * {
   *   "Hello": "Hallo"
   * }
   * ```
   *
   * @example With the context:
   * ```ts
   * {
   *   "View": [
   *     { msgstr: "Rechnung ansehen", msgctxt: "InvoicesTableRowActionMenu" },
   *     { msgstr: "Siehe" },
   *   ]
   * }
   * ```
   * In the example with context, `InvoicesTableRowActionMenu` is the context for the message "View".
   * This can be useful when the same message ID needs to be translated differently in different contexts.
   */
  messages?: MoniteSupportedMessages;

  /**
   * `currencyNumberFormat` responsible for currency formatting.
   */
  currencyNumberFormat?: {
    /**
     * Determines the format in which currency values are displayed.
     *
     * Possible values are:
     * - 'symbol': The currency is represented using its symbol (e.g., $ for USD)
     * - 'code': The currency is represented using its ISO code (e.g., USD for US Dollar)
     * - 'name': The currency is represented using its full name (e.g., US Dollar)
     */
    display?: 'symbol' | 'code' | 'name';

    /**
     * The locale code to use for formatting the currency number.
     * If not provided, the `code` will be used.
     *
     * @example 'en-US', 'de-DE', 'en-150', etc.
     */
    localeCode?: string;
  };

  /**
   * `dateFormat` responsible for date & time formatting. It is used in the `Intl.DateTimeFormat` constructor.
   *
   * By default, it uses the following options:
   * ```ts
   * {
   *   day: '2-digit',
   *   month: 'short',
   *   year: 'numeric',
   *   hour: '2-digit',
   *   minute: '2-digit',
   * }
   * ```
   */
  dateFormat?: Pick<
    Intl.DateTimeFormatOptions,
    | 'weekday'
    | 'year'
    | 'month'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'timeZoneName'
    | 'hour12'
    | 'timeZone'
  >;
};

/**
 * Locale configuration with required fields
 */
export type MoniteLocaleWithRequired = DeepRequired<
  Omit<MoniteLocale, 'messages' | 'dateFormat'>
> &
  Partial<Pick<MoniteLocale, 'messages' | 'dateFormat'>> & {
    dateTimeFormat?: Intl.DateTimeFormatOptions;
  };

/**
 * Makes all properties in T and its nested objects required
 */
export type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>; 