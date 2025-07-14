import { useMemo, useCallback } from 'react';
import { UseFormSetValue, FieldValues, Path } from 'react-hook-form';

import { components } from '@/api';
import { getNestedValue } from '@/core/utils/object';

type PayableCounterpartRawData = components['schemas']['CounterpartRawData'];

// Type that ensures values are valid nested keys from CounterpartRawData
// Based on the known structure of CounterpartRawData schema
type ValidCounterpartRawDataKeys =
  | keyof PayableCounterpartRawData
  | 'address.city'
  | 'address.country'
  | 'address.line1'
  | 'address.line2'
  | 'address.postal_code'
  | 'address.state'
  | 'bank_account.account_holder_name'
  | 'bank_account.account_number'
  | 'bank_account.bic'
  | 'bank_account.iban'
  | 'bank_account.sort_code'
  | 'vat_id.country'
  | 'vat_id.type'
  | 'vat_id.value';

export type CounterpartFormFieldsRawMapping = {
  [key: string]: ValidCounterpartRawDataKeys;
};

/**
 * Helper function to retrieve nested values from payableCounterpartRawData
 * @param rawData - The raw counterpart data object
 * @param rawKey - The key to retrieve (can be nested with dots)
 * @returns The value at the specified key, or undefined if not found
 */
const getRawValue = (
  rawData: PayableCounterpartRawData,
  rawKey: ValidCounterpartRawDataKeys
): any => {
  return typeof rawKey === 'string' && rawKey.includes('.')
    ? getNestedValue(rawData, rawKey)
    : rawData[rawKey as keyof PayableCounterpartRawData];
};

/**
 * Hook for handling inline suggestions from raw counterpart data.
 * Compares form values with raw data and provides utilities for updating fields.
 *
 * @template TFormValues - The type of form values (extends FieldValues)
 *
 * @param payableCounterpartRawData - Raw data from OCR or other sources
 * @param formValues - Current form values from React Hook Form
 * @param setValue - React Hook Form's setValue function
 * @param fieldsMapping - Mapping between form field names and raw data field paths
 *
 * @returns Object containing:
 * - fieldsEqual: Record of field names to boolean indicating if form value matches raw data
 * - allFieldsEqual: Boolean indicating if all mapped fields are equal
 * - updateFormWithRawData: Function to update all fields with raw data values
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { fieldsEqual, allFieldsEqual, updateFormWithRawData } =
 *   usePayableCounterpartRawDataSuggestions(
 *     payableCounterpartRawData,
 *     formValues,
 *     setValue,
 *     {
 *       email: 'email',
 *       phone: 'phone',
 *       line1: 'address.line1',
 *       city: 'address.city',
 *     }
 *   );
 *
 * // Using the returned values
 * const showUpdateButton = !!payableCounterpartRawData && !allFieldsEqual;
 *
 * // In your JSX
 * <InlineSuggestionFill
 *   rawData={payableCounterpartRawData?.email}
 *   isHidden={fieldsEqual['email']}
 *   fieldOnChange={(value) => setValue('email', value)}
 * />
 *
 * {showUpdateButton && (
 *   <Button onClick={updateFormWithRawData}>
 *     Update to match bill
 *   </Button>
 * )}
 * ```
 */
export const usePayableCounterpartRawDataSuggestions = <
  TFormValues extends FieldValues = FieldValues
>(
  payableCounterpartRawData: PayableCounterpartRawData | undefined,
  formValues: TFormValues,
  setValue: UseFormSetValue<TFormValues>,
  fieldsMapping: CounterpartFormFieldsRawMapping
) => {
  const { fieldsEqual, allFieldsEqual } = useMemo(() => {
    if (!payableCounterpartRawData)
      return { fieldsEqual: {}, allFieldsEqual: false };

    const fieldsEqual: Record<string, boolean> = {};
    Object.entries(fieldsMapping).forEach(([formField, rawKey]) => {
      const rawValue = getRawValue(payableCounterpartRawData, rawKey);

      // Consider no value as equal to avoid showing suggestions
      if (rawValue === undefined || rawValue === null) {
        fieldsEqual[formField] = true;
        return;
      }

      const formValue = formField
        .split('.')
        .reduce((acc: any, key) => acc?.[key], formValues);
      fieldsEqual[formField] = formValue === rawValue;
    });

    const allFieldsEqual = Object.values(fieldsEqual).every((value) => value);

    return { fieldsEqual, allFieldsEqual };
  }, [payableCounterpartRawData, formValues, fieldsMapping]);

  const updateFormWithRawData = useCallback(() => {
    if (!payableCounterpartRawData) return false;

    let anyChanged = false;

    Object.entries(fieldsMapping).forEach(([formField, rawKey]) => {
      const rawValue = getRawValue(payableCounterpartRawData, rawKey);

      const formValue = formField
        .split('.')
        .reduce((acc: any, key) => acc?.[key], formValues);

      if (!!rawValue && formValue !== rawValue) {
        setValue(formField as Path<TFormValues>, rawValue);
        anyChanged = true;
      }
    });

    return anyChanged;
  }, [payableCounterpartRawData, formValues, setValue, fieldsMapping]);

  return { fieldsEqual, allFieldsEqual, updateFormWithRawData };
};
