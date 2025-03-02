import { Controller, FieldPath } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface RHFSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const RHFSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  rules,
  shouldUnregister,
  disabled,
  defaultValue,
  required,
}: RHFSelectProps<TFieldValues, TName>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          className="Monite-Currency-SingleLine"
          fullWidth
          variant="standard"
          error={!!error?.message}
        >
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            value={field.value || ''}
            onChange={(event) => field.onChange(event.target.value)}
            label={label}
            required={required}
            renderValue={(selectedValue) => {
              const selectedOption = options.find(
                (option) => option.value === selectedValue
              );
              return selectedOption ? selectedOption.value : '';
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error?.message && (
            <span style={{ color: 'red' }}>{error.message}</span>
          )}
        </FormControl>
      )}
    />
  );
};
