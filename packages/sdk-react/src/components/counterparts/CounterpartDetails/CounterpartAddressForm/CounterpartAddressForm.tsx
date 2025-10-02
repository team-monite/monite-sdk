import type { CounterpartAddressFormFields } from './validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { USStatesEnum } from '@/enums/USStatesEnum';
import { MoniteCountry } from '@/ui/Country';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Paper,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { Controller, FieldPath, useFormContext } from 'react-hook-form';

export const CounterpartAddressForm = ({
  parentField,
}: {
  parentField?: string;
}) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const { root } = useRootElements();
  type Form = typeof parentField extends string
    ? { [key in typeof parentField]: CounterpartAddressFormFields }
    : CounterpartAddressFormFields;

  const { control, watch } = useFormContext<Form>();

  const fieldPath = (
    path: FieldPath<CounterpartAddressFormFields>
  ): FieldPath<Form> => {
    if (parentField) return `${parentField}.${path}` as FieldPath<Form>;
    return path as FieldPath<Form>;
  };
  return (
    <Paper variant="outlined" sx={{ padding: 2, borderRadius: 3 }}>
      <Stack spacing={2}>
        <MoniteCountry
          name={fieldPath('country')}
          control={control}
          required
          fullWidth
          allowedCountries={componentSettings?.onboarding?.allowedCountries}
        />
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
          render={({ field, fieldState: { error }, formState }) =>
            watch(fieldPath('country')) === 'US' ? (
              <FormControl
                variant="standard"
                sx={{ marginBottom: '1rem' }}
                fullWidth
                required
                error={Boolean(error)}
              >
                <InputLabel id="type_of_code">{t(i18n)`State`}</InputLabel>
                <Select
                  id={field.name}
                  fullWidth
                  required
                  error={Boolean(error)}
                  MenuProps={{ container: root }}
                  {...field}
                >
                  {Object.entries(USStatesEnum).map(([code, name]) => (
                    <MenuItem key={code} value={code}>
                      {name} — {code}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText>{error?.message}</FormHelperText>}
              </FormControl>
            ) : (
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
            )
          }
        />
      </Stack>
    </Paper>
  );
};
