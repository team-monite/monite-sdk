import { type Messages } from '@lingui/core';
import { type DeepRequired } from 'react-hook-form';

type MoniteSupportedMessages = Messages;

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

export type MoniteLocaleWithRequired = DeepRequired<
  Omit<MoniteLocale, 'messages' | 'dateFormat'>
> &
  Partial<Pick<MoniteLocale, 'messages' | 'dateFormat'>> & {
    dateTimeFormat?: Intl.DateTimeFormatOptions;
  };
