import { getCounterpartName } from '../../helpers';
import { InlineSuggestionFill } from '../CounterpartForm/InlineSuggestionFill';
import {
  usePayableCounterpartRawDataSuggestions,
  CounterpartFormFieldsRawMapping,
} from '../CounterpartForm/usePayableCounterpartRawDataSuggestions';
import {
  type CounterpartBankFormProps,
  useCounterpartBankForm,
} from './useCounterpartBankForm';
import { type CounterpartBankFormFields } from './validation';
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

const bankFieldsMapping: CounterpartFormFieldsRawMapping = {
  account_holder_name: 'bank_account.account_holder_name',
  account_number: 'bank_account.account_number',
  sort_code: 'bank_account.sort_code',
  bic: 'bank_account.bic',
  iban: 'bank_account.iban',
};

export const CounterpartBankForm = (props: CounterpartBankFormProps) => {
  const { i18n } = useLingui();
  const {
    methods,
    counterpart,
    bank,
    formId,
    saveBank,
    isLoading,
    payableCounterpartRawData,
  } = useCounterpartBankForm(props);

  const { control, handleSubmit, watch, clearErrors, resetField, setValue } =
    methods;

  const values = watch();

  const { currencyGroups, isLoadingCurrencyGroups } =
    useProductCurrencyGroups();

  const { fieldsEqual, allFieldsEqual, updateFormWithRawData } =
    usePayableCounterpartRawDataSuggestions<CounterpartBankFormFields>(
      payableCounterpartRawData,
      values,
      setValue,
      bankFieldsMapping
    );

  const showFillMatchBillButton =
    !!payableCounterpartRawData?.bank_account && !allFieldsEqual;

  useEffect(() => {
    if (values.country) {
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
  }, [clearErrors, resetField, values.country]);

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
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`Bank account holder name`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={
                      payableCounterpartRawData?.bank_account
                        ?.account_holder_name
                    }
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="iban"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`IBAN`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.bank_account?.iban}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="account_number"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`Account number`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={
                      payableCounterpartRawData?.bank_account?.account_number
                    }
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              name="sort_code"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`Sort code`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.bank_account?.sort_code}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
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
                <div>
                  <TextField
                    id={field.name}
                    label={t(i18n)`BIC`}
                    variant="standard"
                    fullWidth
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...field}
                  />
                  <InlineSuggestionFill
                    rawData={payableCounterpartRawData?.bank_account?.bic}
                    isHidden={fieldsEqual[field.name]}
                    fieldOnChange={field.onChange}
                  />
                </div>
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
        secondaryButton={
          showFillMatchBillButton
            ? {
                label: t(i18n)`Update to match bill`,
                onTheLeft: true,
                onClick: () => updateFormWithRawData(),
              }
            : undefined
        }
        cancelButton={{
          onClick: props.onCancel,
        }}
      />
    </>
  );
};
