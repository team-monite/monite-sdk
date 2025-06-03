import { UseFormSetValue } from 'react-hook-form';

import { DeepKeys } from '@/core/types/utils';

import { rateMinorToMajor, rateMajorToMinor } from '@/core/utils/currencies';

import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from '../validation';

export type LineItemPath =
  DeepKeys<CreateReceivablesFormBeforeValidationLineItemProps>;

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

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  if (!Array.isArray(error)) {
    return undefined;
  }

  const keys = path.split('.');

  const specificError = error.find((item: unknown) => {
    if (!item) return false;

    if (typeof item !== 'object' || item === null) return false;

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

  let result: Record<string, unknown> = specificError as Record<
    string,
    unknown
  >;
  for (const k of keys) {
    if (!result || typeof result !== 'object' || result === null)
      return undefined;
    result = result[k] as Record<string, unknown>;
  }

  return result && typeof result === 'object' && 'message' in result
    ? String(result.message)
    : undefined;
}

/**
 * Retrieves a specific error message for a line item field.
 * This is a specialized version of getErrorMessage for line item paths.
 *
 * @param error The error object or array containing validation errors.
 * @param path The LineItemPath (type-safe path) to the line item's error message.
 * @returns The error message string if found, otherwise undefined.
 */
export function getLineItemErrorMessage(
  error: unknown,
  path: LineItemPath
): string | undefined {
  return getErrorMessage(error, path);
}

/**
 * Sets a value in the form with optional validation using React Hook Form's setValue.
 *
 * @param name The name of the field to set.
 * @param value The value to set for the field.
 * @param shouldValidate Optional. Whether to trigger validation after setting the value. Defaults to true.
 * @param setValue The setValue function provided by React Hook Form's useForm.
 */
export const setValueWithValidation = (
  name: string,
  value: unknown,
  shouldValidate = true,
  setValue: UseFormSetValue<CreateReceivablesFormBeforeValidationProps>
) => {
  // Need to use any due to React Hook Form's typing limitations
  setValue(name as any, value, {
    shouldValidate,
    shouldDirty: true,
  });
};

/**
 * Processes a string input value for a tax/VAT rate to ensure it's a number between 0 and 100.
 *
 * @param inputValue The raw input string, typically from a text field.
 * @returns A number representing the tax/VAT rate, constrained between 0 and 100. Returns 0 for empty or invalid inputs.
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
  // Remove leading zeros (but keep values like 0.5)
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
