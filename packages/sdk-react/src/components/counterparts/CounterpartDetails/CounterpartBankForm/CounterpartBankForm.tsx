import { getCounterpartName } from '../../helpers';
import {
  type CounterpartBankFormProps,
  useCounterpartBankForm,
} from './useCounterpartBankForm';
import { useProductCurrencyGroups } from '@/core/hooks/useProductCurrencyGroups';
import { MoniteCountry } from '@/ui/Country';
import { MoniteCurrency } from '@/ui/Currency';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DialogContent, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

export const CounterpartBankForm = (props: CounterpartBankFormProps) => {
  const { i18n } = useLingui();
  const { methods, counterpart, bank, formId, saveBank, isLoading } =
    useCounterpartBankForm(props);

  const { control, handleSubmit, watch, clearErrors } = methods;

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
    }
  }, [clearErrors, country]);

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
      <DialogFooter
        primaryButton={{
          label: t(i18n)`Save`,
          formId: formId,
          isLoading: isLoading,
        }}
        cancelButton={{
          onClick: props.onCancel,
        }}
      />
    </>
  );
};
