import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { useProductCurrencyGroups } from '@/core/hooks/useProductCurrencyGroups';
import { MoniteCountry } from '@/ui/Country';
import { MoniteCurrency } from '@/ui/Currency';
import { DialogHeader } from '@/ui/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  TextField,
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
    formId,
    saveBank,
    isLoading,
  } = useCounterpartBankForm(props);
  const country = watch('country');

  const { currencyGroups, isLoadingCurrencyGroups } =
    useProductCurrencyGroups();

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
      <DialogHeader
        secondaryLevel
        previousLevelTitle={getCounterpartName(counterpart)}
        title={bank ? t(i18n)`Edit bank account` : t(i18n)`Add bank account`}
        closeSecondaryLevelDialog={props.onCancel}
      />
      <DialogContent>
        <form id={formId} onSubmit={handleSubmit(saveBank)} noValidate>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Display name`}
                  variant="standard"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="account_holder_name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  id={field.name}
                  label={t(i18n)`Bank account holder name`}
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
                  fullWidth
                  error={Boolean(error)}
                  helperText={error?.message}
                  {...field}
                />
              )}
            />
            <MoniteCountry name="country" control={control} required />
            <MoniteCurrency
              name="currency"
              control={control}
              required
              groups={currencyGroups}
              disabled={isLoadingCurrencyGroups}
            />
          </Stack>
        </form>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button variant="text" onClick={props.onCancel}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="contained"
            disabled={isLoading}
          >
            {t(i18n)`Save`}
          </Button>
        </Stack>
      </DialogActions>
    </>
  );
};
