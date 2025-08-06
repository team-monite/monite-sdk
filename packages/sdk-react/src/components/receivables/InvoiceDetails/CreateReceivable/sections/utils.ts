import { rateMinorToMajor, rateMajorToMinor } from '@/core/utils/currencies';
import { generateUniqueId } from '@/utils/uuid';

import { type CreateReceivablesFormBeforeValidationLineItemProps } from '../validation';
import type { CurrencyEnum, LineItemPath, SanitizableLineItem } from './types';

const extractFromObject = (
  obj: Record<string, unknown>,
  pathKeys: string[]
): string | undefined => {
  let current: Record<string, unknown> = obj;

  for (const k of pathKeys) {
    if (typeof current !== 'object' || current === null || !(k in current)) {
      return undefined;
    }
    current = current[k] as Record<string, unknown>;
  }

  return typeof current === 'object' &&
    current !== null &&
    'message' in current &&
    typeof current.message === 'string'
    ? String(current.message)
    : undefined;
};

/**
 * Retrieves a specific error message from an error object or array based on a path.
 *
 * @param error The error object or array containing validation errors.
 * @param path A dot-separated string representing the path to the desired error message.
 * @returns The error message string if found, otherwise undefined.
 */
export function getErrorMessage(
  error: unknown,
  path: string
): string | undefined {
  if (!error) {
    return undefined;
  }

  const isObject = typeof error === 'object';

  if (isObject && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  const keys = path.split('.');
  const notArray = !Array.isArray(error);

  if (notArray && isObject) {
    return extractFromObject(error as Record<string, unknown>, keys);
  }

  if (notArray) return undefined;

  const specificError = error.find((item: unknown) => {
    if (!item || typeof item !== 'object' || item === null) return false;

    let current: Record<string, unknown> = item as Record<string, unknown>;

    for (const k of keys) {
      if (typeof current !== 'object' || current === null || !(k in current)) {
        return false;
      }

      current = current[k] as Record<string, unknown>;
    }

    return (
      typeof current === 'object' &&
      current !== null &&
      'message' in current &&
      typeof current.message === 'string'
    );
  });

  if (!specificError) {
    return undefined;
  }

  return extractFromObject(specificError as Record<string, unknown>, keys);
}

/**
 * Retrieves a specific error message for a line item field.
 * This is a specialized version of getErrorMessage for line item paths.
 *
 * @param error The error object or array containing validation errors.
 * @param path The LineItemPath (type-safe path) to the line item's error message.
 * @returns The error message string if found, otherwise undefined.
 */
export const getLineItemErrorMessage = (error: unknown, path: LineItemPath) =>
  getErrorMessage(error, path);

/**
 * Handles tax/VAT rate input value
 *
 * @param inputValue The raw input string from the TextField
 * @returns A number between 0 and 100 suitable for tax/VAT rates
 */
export const processTaxRateValue = (inputValue: string): number => {
  if (inputValue === '') {
    return 0;
  }

  const numValue = Number(inputValue);

  if (isNaN(numValue)) {
    return 0;
  }

  return Math.min(Math.max(numValue, 0), 100);
};

/**
 * Formats the value of an input element intended for tax/VAT rates.
 * Specifically, it removes leading zeros unless the value is a decimal like "0.5".
 *
 * @param inputElement The HTMLInputElement whose value needs to be formatted.
 */
export const formatTaxRate = (inputElement: HTMLInputElement): void => {
  if (
    inputElement.value.startsWith('0') &&
    inputElement.value.length > 1 &&
    !inputElement.value.startsWith('0.')
  ) {
    const newValue = inputElement.value.replace(/^0+/, '');

    inputElement.value = newValue || '0';
  }
};

/**
 * Converts a minor unit value to a locale-formatted major unit string.
 * Example: 12345 (minor units) with 'en-US' locale -> "123.45"
 *
 * @param minorValue The numeric value in minor units (e.g., cents).
 * @param numberFormatter An Intl.NumberFormat instance configured for the desired locale and currency.
 * @returns A string representing the value in major units, formatted according to the locale, or an empty string if minorValue is undefined or NaN.
 */
export const formatMinorToMajorCurrency = (
  minorValue: number | undefined,
  numberFormatter: Intl.NumberFormat
): string => {
  if (minorValue === undefined || isNaN(minorValue)) return '';

  const majorValue = rateMinorToMajor(minorValue);

  return numberFormatter.format(majorValue);
};

/**
 * Converts a locale-formatted major unit string to a minor unit number.
 * Example: "1,234.56" with English locale -> 123456
 *
 * @param majorValueString The string representing the value in major units, formatted according to a specific locale.
 * @param localeDecimalSeparator The decimal separator character used in majorValueString (e.g., "." or ",").
 * @param localeGroupSeparator Optional. The group separator character used in majorValueString (e.g., "," or ".").
 * @returns A number representing the value in minor units. Returns 0 for empty or invalid input strings.
 */
export const parseMajorToMinorCurrency = (
  majorValueString: string,
  localeDecimalSeparator: string,
  localeGroupSeparator?: string
): number => {
  if (majorValueString.trim() === '') return 0;

  let normalizedValue = majorValueString;
  if (localeGroupSeparator) {
    const escapedGroupSeparator = localeGroupSeparator.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );
    normalizedValue = normalizedValue.replace(
      new RegExp(escapedGroupSeparator, 'g'),
      ''
    );
  }
  normalizedValue = normalizedValue.replace(localeDecimalSeparator, '.');

  const numValue = parseFloat(normalizedValue);

  if (isNaN(numValue)) return 0;

  return rateMajorToMinor(numValue);
};

const COMMON_DECIMAL_SEPARATOR = '.';

const escapeRegexChars = (str: string) =>
  str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');

const getLocaleSeparators = (locale?: string) => {
  if (typeof Intl === 'undefined' || typeof Intl.NumberFormat === 'undefined') {
    return { decimal: '.', group: ',' };
  }

  try {
    const parts = Intl.NumberFormat(locale).formatToParts(12345.6);
    const decimal = parts.find((part) => part.type === 'decimal')?.value || '.';
    const group = parts.find((part) => part.type === 'group')?.value || ',';

    return { decimal, group };
  } catch (error) {
    console.error('Error getting locale separators:', error);

    return { decimal: '.', group: ',' };
  }
};

/**
 * Parses a string that might contain locale-specific formatting (e.g., commas for decimals)
 * into a standard number.
 *
 * @param inputValue The raw input string.
 * @param locale Optional: The BCP 47 language tag for the locale to use for parsing (e.g., "en-US", "de-DE"). Defaults to browser's locale.
 * @returns A number, or 0 if parsing fails.
 */
export const parseLocaleNumericString = (
  inputValue: string,
  locale?: string
): number => {
  if (typeof inputValue !== 'string' || !inputValue.trim()) {
    return 0;
  }

  const { decimal: localeDecimalSeparator, group: localeGroupSeparator } =
    getLocaleSeparators(locale);
  const cleanedString = inputValue.replace(
    new RegExp(escapeRegexChars(localeGroupSeparator), 'g'),
    ''
  );

  let resultString = '';
  let hasSeparator = false;

  for (const char of cleanedString) {
    if (/\d/.test(char)) {
      resultString += char;
    } else if (char === localeDecimalSeparator && !hasSeparator) {
      resultString += COMMON_DECIMAL_SEPARATOR;
      hasSeparator = true;
    }
  }

  const numValue = parseFloat(resultString);

  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Sanitizes line items for use in invoice creation
 * Formats the data consistently and handles type conversions
 */
export const sanitizeLineItems = (
  items: ReadonlyArray<SanitizableLineItem> | undefined
): CreateReceivablesFormBeforeValidationLineItemProps[] => {
  if (!items || !Array.isArray(items)) return [];

  return items
    .filter((item) => Boolean(item?.product?.name))
    .map((item) => ({
      ...item,
      id: item.product_id || generateUniqueId(),
      quantity: item.quantity ?? 1,
      product: {
        ...item.product,
        type: item.product?.type as 'product' | 'service',
        price: {
          ...(item.product?.price || {}),
          value: item.product?.price?.value ?? 0,
          currency: (item.product?.price?.currency || 'USD') as CurrencyEnum,
        },
        measure_unit_id: item.product?.measure_unit_id || '',
      },
      ...(item.measure_unit?.name
        ? {
            measure_unit: {
              name: item.measure_unit.name,
              id: null,
            },
          }
        : {}),
    }));
};
