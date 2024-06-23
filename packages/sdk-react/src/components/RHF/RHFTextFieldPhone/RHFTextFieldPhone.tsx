'use client';

import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { TextFieldPhone } from '@/components/TextFieldPhone';
import { Alert } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export const RHFTextFieldPhone = <T extends FieldValues>({
  control,
  name,
  ...other
}: UseControllerProps<T> & TextFieldProps) => {
  const isErrorCustom = (error: FieldError | undefined) =>
    error?.type === 'custom';

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { ref, value, onChange, ...otherField },
        fieldState: { error, isTouched },
        formState: { isValid },
      }) => {
        const isInvalid = (isTouched || !isValid) && !isErrorCustom(error);

        return (
          <>
            <TextFieldPhone
              {...otherField}
              {...other}
              id={name}
              onChange={(value) => onChange(value)}
              value={value ?? ''} // This makes component controlled https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled otherwise there are warnings in console
              error={isInvalid && !!error?.message}
              helperText={isInvalid && error?.message}
            />

            {isErrorCustom(error) && (
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
};
