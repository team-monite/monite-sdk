import { UseFormSetValue } from 'react-hook-form';

import { components } from '@/api';
import { DeepKeys } from '@/core/types/utils';
import { generateUniqueId } from '@/utils/uuid';

import {
  CreateReceivablesFormBeforeValidationProps,
  CreateReceivablesFormBeforeValidationLineItemProps,
} from './validation';

type CurrencyEnum = components['schemas']['CurrencyEnum'];

export type LineItemPath =
  DeepKeys<CreateReceivablesFormBeforeValidationLineItemProps>;

export function getErrorMessage(
  error: unknown,
  path: string
): string | undefined {
  if (!error) {
    return undefined;
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

export function getLineItemErrorMessage(
  error: unknown,
  path: LineItemPath
): string | undefined {
  return getErrorMessage(error, path);
}

/**
 * Sets a value in the form with optional validation
 *
 * @param name Field name
 * @param value Field value
 * @param shouldValidate Whether to validate after setting
 * @param setValue Form setValue function
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
 * Handles tax/VAT rate input value
 *
 * @param inputValue The raw input string from the TextField
 * @returns A number between 0 and 100 suitable for tax/VAT rates
 */
export const processTaxRateValue = (inputValue: string): number => {
  // Handle empty input
  if (inputValue === '') {
    return 0;
  }

  // Convert to number
  const numValue = Number(inputValue);

  // Return 0 for invalid numbers
  if (isNaN(numValue)) {
    return 0;
  }

  // Clamp value between 0 and 100
  return Math.min(Math.max(numValue, 0), 100);
};

const COMMON_DECIMAL_SEPARATOR = '.';

/**
 * Parses a string that might contain locale-specific formatting (e.g., commas for decimals)
 * into a standard number.
 *
 * @param inputValue The raw input string.
 * @returns A number, or 0 if parsing fails.
 */
export const parseLocaleNumericString = (inputValue: string): number => {
  if (typeof inputValue !== 'string' || !inputValue.trim()) {
    return 0;
  }

  const buf = inputValue.replace(/,/g, COMMON_DECIMAL_SEPARATOR);

  let resultString = '';
  let hasDot = false;

  for (const char of buf) {
    if (/\d/.test(char)) {
      resultString += char;
    } else if (char === COMMON_DECIMAL_SEPARATOR) {
      if (!hasDot) {
        resultString += COMMON_DECIMAL_SEPARATOR;
        hasDot = true;
      }
    }
  }

  const numValue = parseFloat(resultString);

  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Handles cleaning up the input element for tax/VAT rate fields
 * Fixes issues like leading zeros
 *
 * @param inputElement The input HTML element
 */
export const cleanupTaxRateInput = (inputElement: HTMLInputElement): void => {
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

export type SanitizableLineItem = Omit<
  Partial<CreateReceivablesFormBeforeValidationLineItemProps>,
  'product'
> & {
  product?: Omit<
    Partial<CreateReceivablesFormBeforeValidationLineItemProps['product']>,
    'type'
  > & {
    type?: string;
  };
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
