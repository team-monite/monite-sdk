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
  fieldError,
  setValue,
}: TaxRateControllerProps) => {
  const name = `line_items.${index}.tax_rate_value` as const;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            size="small"
            error={Boolean(fieldError)}
            onChange={(e) => {
              const value = Number(e.target.value);

              setValueWithValidation(name, value, true, setValue);

              field.onChange(e);
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
