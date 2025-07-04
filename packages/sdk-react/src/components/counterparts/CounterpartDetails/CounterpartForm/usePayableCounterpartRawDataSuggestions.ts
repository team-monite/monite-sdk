import { useMemo, useCallback } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { components } from '@/api';

type PayableCounterpartRawData = components['schemas']['CounterpartRawData'];

export type CounterpartFormFieldsRawMapping = {
  [formField: string]: keyof PayableCounterpartRawData;
};

export const usePayableCounterpartRawDataSuggestions = (
  payableCounterpartRawData: PayableCounterpartRawData | undefined,
  formValues: any,
  setValue: UseFormSetValue<any>,
  fieldsMapping: CounterpartFormFieldsRawMapping
) => {
  const { fieldsEqual, allFieldsEqual } = useMemo(() => {
    if (!payableCounterpartRawData)
      return { fieldsEqual: {}, allFieldsEqual: false };

    const fieldsEqual: Record<string, boolean> = {};
    Object.entries(fieldsMapping).forEach(([formField, rawKey]) => {
      const rawValue = payableCounterpartRawData[rawKey];
      if (rawValue === undefined || rawValue === null) return;

      const formValue = formField
        .split('.')
        .reduce((acc, key) => acc?.[key], formValues);
      fieldsEqual[formField] = formValue === rawValue;
    });

    const allFieldsEqual = Object.values(fieldsEqual).every((value) => value);

    return { fieldsEqual, allFieldsEqual };
  }, [payableCounterpartRawData, formValues, fieldsMapping]);

  const updateFormWithRawData = useCallback(() => {
    if (!payableCounterpartRawData) return false;

    let anyChanged = false;

    Object.entries(fieldsMapping).forEach(([formField, rawKey]) => {
      const rawValue = payableCounterpartRawData[rawKey];
      const formValue = formField
        .split('.')
        .reduce((acc, key) => acc?.[key], formValues);

      if (!!rawValue && formValue !== rawValue) {
        setValue(formField, rawValue);
        anyChanged = true;
      }
    });

    return anyChanged;
  }, [payableCounterpartRawData, formValues, setValue, fieldsMapping]);

  return { fieldsEqual, allFieldsEqual, updateFormWithRawData };
};
