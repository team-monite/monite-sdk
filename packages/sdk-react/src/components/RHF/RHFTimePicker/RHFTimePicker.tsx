import { Controller, FieldError } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { Alert } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';
import type { TimePickerProps } from '@mui/x-date-pickers';

export const RHFTimePicker = <T extends FieldValues>({
  control,
  name,
  required,
  fullWidth,
  slotProps,
  ...other
}: UseControllerProps<T> &
  TimePickerProps<Date> & { required?: boolean; fullWidth?: boolean }) => {
  const isErrorCustom = (error: FieldError | undefined) =>
    error?.type === 'custom';

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

        // new Date(null) generates "1970-01-01T00:00:00.000Z" and undefined is not acceptable because component becames uncontrolled
        const date = field.value !== null ? new Date(field.value) : null;

        return (
          <>
            <TimeField
              {...field}
              {...other}
              required={required}
              fullWidth={fullWidth}
              value={date}
              helperText={isInvalid && error?.message}
              slotProps={{
                ...slotProps,
                textField: {
                  ...slotProps?.textField,
                  id: name,
                  error: isInvalid && !!error?.message,
                  helperText: isInvalid && error?.message,
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
