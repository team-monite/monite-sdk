import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { AnyMaskedOptions } from 'imask';

import MaskInput from './MaskInput';

interface RHFTextFieldProps<T> extends UseControllerProps<T> {
  maskProps?: AnyMaskedOptions;
}

const RHFTextField = <T extends FieldValues>({
  control,
  name,
  maskProps,
  ...other
}: RHFTextFieldProps<T> & TextFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...other}
          id={name}
          error={!!error?.message}
          helperText={error?.message}
          InputProps={
            maskProps
              ? {
                  inputComponent: MaskInput as any,
                  inputProps: maskProps,
                }
              : undefined
          }
        />
      )}
    />
  );
};

export default RHFTextField;
