import { useMemo, useCallback } from 'react';
import { UseFormSetValue, FieldValues, Path } from 'react-hook-form';

import { components } from '@/api';
import { getNestedValue } from '@/core/utils/object';

type PayableCounterpartRawData = components['schemas']['CounterpartRawData'];

// Base type for field mappings
export type CounterpartFormFieldsRawMapping = {
  [formField: string]: keyof PayableCounterpartRawData | string;
};

// Enhanced type that allows specifying nested subtypes
export type CounterpartFormFieldsRawMappingWithSubtypes<
  T = PayableCounterpartRawData
> = {
  [formField: string]: keyof T | string;
};

export const usePayableCounterpartRawDataSuggestions = <
  TRawData extends PayableCounterpartRawData = PayableCounterpartRawData,
  TFormValues extends FieldValues = any
>(
  payableCounterpartRawData: TRawData | undefined,
  formValues: TFormValues,
  setValue: UseFormSetValue<TFormValues>,
  fieldsMapping: CounterpartFormFieldsRawMappingWithSubtypes<TRawData>
) => {
  const { fieldsEqual, allFieldsEqual } = useMemo(() => {
    if (!payableCounterpartRawData)
      return { fieldsEqual: {}, allFieldsEqual: false };

    const fieldsEqual: Record<string, boolean> = {};
    Object.entries(fieldsMapping).forEach(([formField, rawKey]) => {
      const rawValue =
        typeof rawKey === 'string' && rawKey.includes('.')
          ? getNestedValue(payableCounterpartRawData, rawKey)
          : payableCounterpartRawData[rawKey as keyof TRawData];

      if (rawValue === undefined || rawValue === null) return;

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
      const rawValue =
        typeof rawKey === 'string' && rawKey.includes('.')
          ? getNestedValue(payableCounterpartRawData, rawKey)
          : payableCounterpartRawData[rawKey as keyof TRawData];

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
