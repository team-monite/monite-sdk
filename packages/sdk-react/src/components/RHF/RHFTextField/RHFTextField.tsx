import React from 'react';
import { Controller, FieldError } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { Alert, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export const RHFTextField = <T extends FieldValues>({
  control,
  name,
  SelectProps,
  ...other
}: UseControllerProps<T> & TextFieldProps) => {
  const isErrorCustom = (error: FieldError | undefined) =>
    error?.type === 'custom';

  const { root } = useRootElements();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field,
        fieldState: { error, isTouched },
        formState: { isValid },
      }) => {
        const isInvalid = (isTouched || !isValid) && !isErrorCustom(error);

        return (
          <>
            <TextField
              {...field}
              {...other}
              id={name}
              value={field.value ?? ''} // This makes component controlled https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled otherwise there are warnings in console
              error={isInvalid && !!error?.message}
              helperText={isInvalid && error?.message}
              SelectProps={{
                ...SelectProps,
                MenuProps: {
                  ...SelectProps?.MenuProps,
                  container: root,
                },
              }}
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
