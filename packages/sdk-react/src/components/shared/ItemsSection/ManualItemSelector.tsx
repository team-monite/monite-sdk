import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TextField } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface ManualItemSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues>;
  index: number;
  fieldName: Path<TFieldValues>;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}

export const ManualItemSelector = <
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  fieldName,
  placeholder,
  error,
  disabled,
  onBlur,
  onChange,
}: ManualItemSelectorProps<TFieldValues>) => {
  const { i18n } = useLingui();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          placeholder={placeholder || t(i18n)`Line item`}
          fullWidth
          size="small"
          error={error || !!fieldState.error}
          helperText={fieldState.error?.message}
          disabled={disabled}
          onChange={(e) => {
            field.onChange(e);
            onChange?.(e.target.value);
          }}
          onBlur={(_e) => {
            field.onBlur();
            onBlur?.();
          }}
          sx={{ minWidth: '200px' }}
        />
      )}
    />
  );
};
