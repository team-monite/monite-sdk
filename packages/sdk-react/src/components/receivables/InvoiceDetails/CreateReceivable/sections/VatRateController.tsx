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
import { MenuItem, Select } from '@mui/material';

import { CreateReceivablesFormBeforeValidationProps } from '../validation';
import { setValueWithValidation } from './utils';

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
  const [hasSetDefaultVatRate, setHasSetDefaultVatRate] = useState(false);

  const currentVatRateId = getValues(name);

  // Set a default VAT rate if none is set and VAT rates are available
  useEffect(() => {
    if (
      !isNonVatSupported &&
      !currentVatRateId &&
      highestVatRate &&
      !hasSetDefaultVatRate
    ) {
      setValueWithValidation(name, highestVatRate.id, true, setValue);
      setValueWithValidation(
        valueFieldName,
        highestVatRate.value,
        true,
        setValue
      );
      setHasSetDefaultVatRate(true);
    } else if (isNonVatSupported && !hasSetDefaultVatRate) {
      // For non-VAT regions, set VAT rate to null and use tax_rate_value (default to 0%)
      setValueWithValidation(name, null, true, setValue);
      setValueWithValidation(valueFieldName, null, true, setValue);

      // Initialize tax rate to 0 if not set
      if (getValues(taxRateFieldName) === undefined) {
        setValueWithValidation(taxRateFieldName, 0, true, setValue);
      }

      setHasSetDefaultVatRate(true);
    }
  }, [
    currentVatRateId,
    highestVatRate,
    hasSetDefaultVatRate,
    isNonVatSupported,
    name,
    valueFieldName,
    taxRateFieldName,
    setValue,
    getValues,
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
                {(rate.value / 100).toLocaleString(undefined, {
                  style: 'percent',
                  minimumFractionDigits: 2,
                })}
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
};
