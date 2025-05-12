import { Controller, FieldPath, useFormContext } from 'react-hook-form';

import { MoniteCountry } from '@/ui/Country';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Paper, Stack, TextField } from '@mui/material';

import { CounterpartAddressFormFields } from './helpers';

export const CounterpartAddressForm = ({
  parentField,
}: {
  parentField?: string;
}) => {
  const { i18n } = useLingui();

  type Form = typeof parentField extends string
    ? { [key in typeof parentField]: CounterpartAddressFormFields }
    : CounterpartAddressFormFields;

  const { control } = useFormContext<Form>();

  const fieldPath = (
    path: FieldPath<CounterpartAddressFormFields>
  ): FieldPath<Form> => {
    if (parentField) return `${parentField}.${path}` as FieldPath<Form>;
    return path as FieldPath<Form>;
  };
  return (
    <Paper variant="outlined" sx={{ padding: 2, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Controller
          name={fieldPath('line1')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              label={t(i18n)`Address line 1`}
              variant="standard"
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              required
              {...field}
              value={field.value ?? ''}
            />
          )}
        />
        <Controller
          name={fieldPath('line2')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              label={t(i18n)`Address line 2`}
              variant="standard"
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
              value={field.value ?? ''}
            />
          )}
        />
        <Controller
          name={fieldPath('city')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              label={t(i18n)`City`}
              variant="standard"
              fullWidth
              required
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
              value={field.value ?? ''}
            />
          )}
        />
        <Controller
          name={fieldPath('postalCode')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              label={t(i18n)`Postal code`}
              variant="standard"
              fullWidth
              required
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
              value={field.value ?? ''}
            />
          )}
        />
        <Controller
          name={fieldPath('state')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              label={t(i18n)`State / Area / Province`}
              variant="standard"
              fullWidth
              required
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
              value={field.value ?? ''}
            />
          )}
        />
        <MoniteCountry
          name={fieldPath('country')}
          control={control}
          required
          fullWidth
        />
      </Stack>
    </Paper>
  );
};
