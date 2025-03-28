import { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { formatVatRateForDisplay } from '@/core/utils/vatUtils';
import { MenuItem, Select } from '@mui/material';

import { setValueWithValidation } from '../utils';
import { CreateReceivablesFormBeforeValidationProps } from '../validation';

type VatRateResponse = components['schemas']['VatRateResponse'];

interface VatRateControllerProps {
  control: Control<CreateReceivablesFormBeforeValidationProps>;
  index: number;
  errors: FieldErrors<CreateReceivablesFormBeforeValidationProps>;
  fieldError?: FieldError;
  vatRates?: VatRateResponse[];
  isNonVatSupported: boolean;
  highestVatRate?: VatRateResponse;
  setValue: UseFormSetValue<CreateReceivablesFormBeforeValidationProps>;
  getValues: UseFormGetValues<CreateReceivablesFormBeforeValidationProps>;
}

export const VatRateController = ({
  control,
  index,
  fieldError: externalFieldError,
  vatRates,
  getValues,
  setValue,
  isNonVatSupported,
  highestVatRate,
}: VatRateControllerProps) => {
  const { root } = useRootElements();
  const name = `line_items.${index}.vat_rate_id` as const;
  const valueFieldName = `line_items.${index}.vat_rate_value` as const;
  const taxRateFieldName = `line_items.${index}.tax_rate_value` as const;
  const [hasInitialized, setHasInitialized] = useState(false);

  const currentVatRateId = getValues(name);
  const currentVatRateValue = getValues(valueFieldName);
  useEffect(() => {
    if (hasInitialized) {
      return;
    }

    const hasExistingVatRate =
      currentVatRateId && currentVatRateValue !== undefined;

    if (hasExistingVatRate) {
      setHasInitialized(true);
      return;
    }

    if (!isNonVatSupported && highestVatRate) {
      // For VAT-supported regions, always set the highest VAT rate as default
      setValueWithValidation(name, highestVatRate.id, true, setValue);
      setValueWithValidation(
        valueFieldName,
        highestVatRate.value,
        true,
        setValue
      );
      setValueWithValidation(taxRateFieldName, undefined, true, setValue);
    } else if (isNonVatSupported) {
      // For non-VAT regions, set VAT rate to null and use tax_rate_value (default to 0%)
      setValueWithValidation(name, null, true, setValue);
      setValueWithValidation(valueFieldName, null, true, setValue);

      if (getValues(taxRateFieldName) === undefined) {
        setValueWithValidation(taxRateFieldName, 0, true, setValue);
      }
    }

    setHasInitialized(true);
  }, [
    highestVatRate,
    hasInitialized,
    isNonVatSupported,
    name,
    valueFieldName,
    taxRateFieldName,
    setValue,
    getValues,
    index,
    currentVatRateId,
    currentVatRateValue,
  ]);

  // If we're in a non-VAT region, we don't need to show the VAT rate selector
  if (isNonVatSupported) {
    return null;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: vatRateField,
        fieldState: { error: internalFieldError },
      }) => {
        const vatRateId = getValues(name);
        const hasError = Boolean(externalFieldError || internalFieldError);

        return (
          <Select
            MenuProps={{ container: root }}
            {...vatRateField}
            value={vatRateId || ''}
            variant="outlined"
            onChange={(e) => {
              const selectedVatRateId = e.target.value;
              const selectedVatRate = vatRates?.find(
                (rate) => rate.id === selectedVatRateId
              );

              setValueWithValidation(name, selectedVatRateId, false, setValue);

              if (selectedVatRate) {
                setValueWithValidation(
                  valueFieldName,
                  selectedVatRate.value,
                  true,
                  setValue
                );
              }

              vatRateField.onChange(e);
            }}
            error={hasError}
          >
            {vatRates?.map((rate) => (
              <MenuItem key={rate.id} value={rate.id}>
                {formatVatRateForDisplay(rate.value)}
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
};
