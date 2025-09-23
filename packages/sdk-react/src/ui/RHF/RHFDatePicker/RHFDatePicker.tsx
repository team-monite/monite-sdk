import { Controller, FieldError } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import type { DatePickerProps } from '@mui/x-date-pickers';
import { format as formatDate } from 'date-fns';

type RHFDatePickerExtraProps = {
  /**
   * Controls the value stored in form state when a date is selected.
   * - 'date' stores a Date object
   * - 'string' stores a formatted string (see stringFormat)
   * Defaults to 'date' to preserve existing behavior.
   */
  valueAs?: 'date' | 'string';
  /**
   * The date-fns format used when valueAs is 'string'. Defaults to 'yyyy-MM-dd'.
   */
  stringFormat?: string;
};

export const RHFDatePicker = <T extends FieldValues>({
  control,
  name,
  slotProps,
  valueAs = 'date',
  stringFormat = 'yyyy-MM-dd',
  ...other
}: UseControllerProps<T> & DatePickerProps<Date> & RHFDatePickerExtraProps) => {
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

        // new Date(null) generates "1970-01-01T00:00:00.000Z" and undefined is not acceptable because component becames uncontrolled
        const date = field.value !== null ? new Date(field.value) : null;

        return (
          <>
            <DatePicker
              {...field}
              {...other}
              value={date} // This makes component controlled https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled otherwise there are warnings in console
              onChange={(newValue) => {
                if (newValue instanceof Date && !Number.isNaN(newValue.getTime())) {
                  const nextValue =
                    valueAs === 'string' ? formatDate(newValue, stringFormat) : newValue;
                  field.onChange(nextValue);
                } else {
                  field.onChange(null);
                }
              }}
              slotProps={{
                ...slotProps,
                popper: {
                  ...slotProps?.popper,
                  container: root,
                },
                dialog: {
                  ...slotProps?.dialog,
                  container: root,
                },
                textField: {
                  variant: 'standard',
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
