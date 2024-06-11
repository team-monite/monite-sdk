import React from 'react';
import { Controller } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { Alert, Checkbox, FormControlLabel } from '@mui/material';

interface RHFCheckboxProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label?: string;
}

export const RHFCheckbox = <F extends FieldValues>({
  control,
  name,
  label,
  ...other
}: RHFCheckboxProps<F>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, ...field }, fieldState: { error } }) => {
      return (
        <>
          <FormControlLabel
            {...other}
            {...field}
            id={name}
            label={label}
            checked={value}
            control={<Checkbox />}
          />
          {error?.message && (
            <Alert
              severity="error"
              icon={false}
              sx={{
                marginTop: -2,
              }}
            >
              {error?.message}
            </Alert>
          )}
        </>
      );
    }}
  />
);
