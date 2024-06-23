'use client';

import React, { useEffect, useId } from 'react';
import { Controller } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { getCountries } from '@/core/utils/countries';
import { countriesToSelect } from '@/core/utils/selectHelpers';
import { MoniteCurrency } from '@/ui/Currency';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Typography,
  Stack,
  Divider,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from '@mui/material';

import { getCounterpartName } from '../../helpers';
import {
  useCounterpartBankForm,
  CounterpartBankFormProps,
} from './useCounterpartBankForm';

export const CounterpartBankForm = (props: CounterpartBankFormProps) => {
  const { i18n } = useLingui();
  const {
    methods: { control, handleSubmit, watch, clearErrors, resetField },
    counterpart,
    bank,
    formRef,
    submitForm,
    saveBank,
    isLoading,
  } = useCounterpartBankForm(props);
  const { root } = useRootElements();
  const country = watch('country');

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-counterpartBank-${useId()}`;

  useEffect(() => {
    if (country) {
      /**
       * We have to clean all errors except `currency`
       *  because `currency` always required but other fields
       *  may or may not be based on many attributes
       */
      clearErrors([
        'iban',
        'account_holder_name',
        'account_number',
        'bic',
        'sort_code',
        'routing_number',
      ]);

      resetField('sort_code');
      resetField('account_number');
      resetField('routing_number');
    }
  }, [clearErrors, resetField, country]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!counterpart) return null;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ padding: 3 }}
      >
        <Typography variant="caption">
          {getCounterpartName(counterpart)}
        </Typography>
        <ArrowForwardIcon fontSize="small" color="disabled" />
        <Typography variant="caption" data-testid="bankName">
          {Boolean(bank) ? watch('name') : t(i18n)`Add bank account`}
        </Typography>
      </Stack>
      <Divider />
      <DialogContent>
        <form id={formName} ref={formRef} onSubmit={handleSubmit(saveBank)}>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account name`}
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="iban"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`IBAN`}
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="account_number"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Account number`}
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="sort_code"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Sort code`}
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="routing_number"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Routing number`}
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="bic"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`BIC`}
                  variant="outlined"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
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
                  <InputLabel id={field.name}>{t(i18n)`Country`}</InputLabel>
                  <Select
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
            <MoniteCurrency name="currency" control={control} required />
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
          onClick={submitForm}
          disabled={isLoading}
        >
          {Boolean(bank)
            ? t(i18n)`Update bank account`
            : t(i18n)`Add bank account`}
        </Button>
      </DialogActions>
    </>
  );
};
