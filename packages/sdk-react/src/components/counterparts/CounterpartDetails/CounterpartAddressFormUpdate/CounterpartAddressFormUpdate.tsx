import React from 'react';
import { Controller } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { getCountries } from '@/core/utils/countries';
import { countriesToSelect } from '@/core/utils/selectHelpers';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  DialogContent,
  Divider,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  DialogActions,
  Button,
} from '@mui/material';

import { prepareCounterpartAddressSubmit } from '../CounterpartAddressForm';
import {
  useCounterpartAddressFormUpdate,
  CounterpartAddressFormUpdateProps,
} from './useCounterpartAddressFormUpdate';

export const CounterpartAddressFormUpdate = (
  props: CounterpartAddressFormUpdateProps
) => {
  const { i18n } = useLingui();
  const {
    methods: { control, handleSubmit },
    formRef,
    submitForm,
    updateAddress,
    isLoading,
  } = useCounterpartAddressFormUpdate(props);
  const { root } = useRootElements();

  return (
    <>
      <Typography variant="h3" sx={{ padding: 3 }}>
        {t(i18n)`Address`}
      </Typography>
      <Divider />
      <DialogContent>
        <form
          id="counterpartBankForm"
          ref={formRef}
          onSubmit={handleSubmit((values) => {
            updateAddress(prepareCounterpartAddressSubmit(values));
          })}
        >
          <Stack spacing={3}>
            <Controller
              name="line1"
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
              name="line2"
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
              name="city"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`City`}
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
              name="postalCode"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`ZIP code`}
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
              name="state"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`State / Area / Province`}
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
              name="country"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={Boolean(error)}
                >
                  <InputLabel htmlFor={field.name}>
                    {t(i18n)`Country`}
                  </InputLabel>
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
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={props.onCancel}>
          {t(i18n)`Cancel`}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          onClick={submitForm}
          disabled={isLoading}
        >
          {t(i18n)`Update`}
        </Button>
      </DialogActions>
    </>
  );
};
