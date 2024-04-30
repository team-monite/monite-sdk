import React from 'react';
import { Controller, useFormContext, FieldPath } from 'react-hook-form';

import { Select } from '@/components/Select/Select';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { getCountries } from '@/core/utils/countries';
import { countriesToSelect } from '@/core/utils/selectHelpers';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';

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
  const { root } = useRootElements();

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
              variant="outlined"
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              required
              {...field}
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
              variant="outlined"
              fullWidth
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
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
              variant="outlined"
              fullWidth
              required
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name={fieldPath('postalCode')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              label={t(i18n)`ZIP code`}
              variant="outlined"
              fullWidth
              required
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
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
              variant="outlined"
              fullWidth
              required
              error={Boolean(error)}
              helperText={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name={fieldPath('country')}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl
              variant="outlined"
              fullWidth
              required
              error={Boolean(error)}
            >
              <InputLabel htmlFor={field.name}>{t(i18n)`Country`}</InputLabel>
              <Select
                id={field.name}
                labelId={field.name}
                label={t(i18n)`Country`}
                MenuProps={{ container: root }}
                {...field}
              >
                {countriesToSelect(getCountries(i18n)).map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Stack>
    </Paper>
  );
};
