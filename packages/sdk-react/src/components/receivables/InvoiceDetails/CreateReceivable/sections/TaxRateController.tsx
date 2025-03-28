import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

import { InputAdornment, TextField } from '@mui/material';

import { CreateReceivablesFormBeforeValidationProps } from '../validation';
import {
  setValueWithValidation,
  processTaxRateValue,
  formatTaxRate,
} from './utils';

interface TaxRateControllerProps {
  control: Control<CreateReceivablesFormBeforeValidationProps>;
  index: number;
  errors: FieldErrors<CreateReceivablesFormBeforeValidationProps>;
  fieldError: FieldError | undefined;
  getValues: UseFormGetValues<CreateReceivablesFormBeforeValidationProps>;
  setValue: UseFormSetValue<CreateReceivablesFormBeforeValidationProps>;
}

export const TaxRateController = ({
  control,
  index,
  fieldError: externalFieldError,
  setValue,
}: TaxRateControllerProps) => {
  const name = `line_items.${index}.tax_rate_value` as const;

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ...field },
        fieldState: { error: internalFieldError },
      }) => {
        const hasError = Boolean(externalFieldError || internalFieldError);

        return (
          <TextField
            {...field}
            value={value ?? ''}
            type="number"
            inputProps={{
              min: 0,
              max: 100,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            size="small"
            error={hasError}
            onChange={(e) => {
              const processedValue = processTaxRateValue(e.target.value);

              setValueWithValidation(name, processedValue, true, setValue);
              onChange(processedValue);
            }}
            onInput={(e) => {
              formatTaxRate(e.target as HTMLInputElement);
            }}
            sx={{
              width: '120px',
            }}
          />
        );
      }}
    />
  );
};
