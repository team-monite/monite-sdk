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
import { setValueWithValidation } from './utils';

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
        let numericValue = 0;

        if (value !== undefined && value !== null) {
          numericValue = typeof value === 'number' ? value : Number(value);
          if (isNaN(numericValue)) numericValue = 0;
        }

        const hasError = Boolean(externalFieldError || internalFieldError);

        return (
          <TextField
            {...field}
            value={numericValue}
            type="number"
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            size="small"
            error={hasError}
            onChange={(e) => {
              const numValue = Number(e.target.value);
              const validValue = !isNaN(numValue) ? numValue : 0;

              setValueWithValidation(name, validValue, true, setValue);
              onChange(validValue);
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
