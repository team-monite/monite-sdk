import type { SyntheticEvent } from 'react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';
import {
  countryCurrencyList,
  getCountriesArray,
  CountryType,
} from '@/core/utils/countries';
import { MoniteCountry } from '@/ui/Country';
import { MoniteCurrency } from '@/ui/Currency';
import { safeZodResolver } from '@/core/utils/safeZodResolver';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Stack, Switch, TextField, Typography } from '@mui/material';

import { useSetDefaultBankAccount } from '../hooks';
import { 
  type EntityBankAccountFields,
  getEntityBankAccountValidationSchema
} from '../validation';
import {
  prepareBankAccountCreatePayload,
  prepareBankAccountUpdatePayload,
} from '../utils';
import { BankAccountCustomFields } from './BankAccountCustomFields';
import { FormSelect } from './FormSelect';

type Props = {
  bankAccount?: components['schemas']['EntityBankAccountResponse'];
  bankAccounts: components['schemas']['EntityBankAccountResponse'][];
  formId: string;
  createBankAccount: (
    payload: components['schemas']['CreateEntityBankAccountRequest']
  ) => void;
  updateBankAccount: (
    payload: components['schemas']['UpdateEntityBankAccountRequest']
  ) => void;
};

export const BankAccountFormContent = ({
  bankAccounts,
  bankAccount,
  formId,
  createBankAccount,
  updateBankAccount,
}: Props) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const { data: entity } = useMyEntity();
  const currentEntityCurrency = countryCurrencyList?.find(
    (item) => item.country === entity?.address?.country
  );
  const { mutate: setAsDefault } = useSetDefaultBankAccount(false, false);

  const countryOptions = useMemo(
    () =>
      getCountriesArray(i18n).filter((countryItem) =>
        componentSettings?.receivables?.bankAccountCountries?.includes(
          countryItem?.code as components['schemas']['AllowedCountries']
        )
      ),
    [componentSettings, i18n]
  );

  const defaultValues: EntityBankAccountFields = {
    is_default_for_currency: false,
    country:
      bankAccount?.country ??
      (currentEntityCurrency?.country as components['schemas']['AllowedCountries']),
    currency:
      bankAccount?.currency ??
      (currentEntityCurrency?.currency as components['schemas']['CurrencyEnum']),
    display_name:
      bankAccount?.display_name ??
      t(i18n)`Bank account ${bankAccounts?.length + 1}`,
    bank_name: bankAccount?.bank_name ?? '',
    account_holder_name: bankAccount?.account_holder_name ?? '',
    account_number: bankAccount?.account_number ?? '',
    routing_number: bankAccount?.routing_number ?? '',
    sort_code: bankAccount?.sort_code ?? '',
    bic: bankAccount?.bic ?? '',
    iban: bankAccount?.iban ?? '',
  };

  const { watch, control, handleSubmit, setValue, clearErrors } =
    useForm<EntityBankAccountFields>({
      resolver: safeZodResolver<EntityBankAccountFields>(getEntityBankAccountValidationSchema(i18n, Boolean(bankAccount))),
      defaultValues,
    });

  const currency = watch('currency') as components['schemas']['CurrencyEnum'];
  const isDefaultForCurrency = watch('is_default_for_currency');

  const filteredBanksByCurrency = bankAccounts?.filter(
    (bank) => bank?.currency === (bankAccount?.currency || currency)
  );

  const handleCountryChange = (
    _event: SyntheticEvent,
    value: (CountryType | string) | (CountryType | string)[] | null
  ) => {
    if (Array.isArray(value) || !value) return;

    let countryCode: CountryType['code'] | undefined;

    if (typeof value === 'string') {
      countryCode = value as CountryType['code'];
    } else if (typeof value === 'object' && value !== null && 'code' in value) {
      countryCode = value.code;
    }

    if (countryCode) {
      const currentCountry = countryCurrencyList?.find(
        (item) => item.country === countryCode
      );

      if (currentCountry?.currency) {
        setValue(
          'currency',
          currentCountry.currency as components['schemas']['CurrencyEnum']
        );
        clearErrors('currency');
      }
    }
  };

  const submitForm = (values: EntityBankAccountFields) => {
    if (bankAccount) {
      if (!bankAccount?.is_default_for_currency && isDefaultForCurrency) {
        setAsDefault({
          path: { bank_account_id: bankAccount?.id },
        });
      }
      updateBankAccount(
        prepareBankAccountUpdatePayload(
          {
            display_name: values?.display_name,
            account_holder_name: values?.account_holder_name,
          },
          currency
        )
      );
    } else {
      createBankAccount(
        prepareBankAccountCreatePayload({
          is_default_for_currency:
            filteredBanksByCurrency?.length === 0
              ? true
              : Boolean(values?.is_default_for_currency),
          bic: values?.bic,
          iban: values?.iban,
          account_holder_name: values?.account_holder_name,
          account_number: values?.account_number,
          routing_number: values?.routing_number,
          sort_code: values?.sort_code,
          bank_name: values?.bank_name,
          display_name: values?.display_name,
          country: values?.country as components['schemas']['AllowedCountries'],
          currency: values?.currency as components['schemas']['CurrencyEnum'],
        })
      );
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(submitForm)} noValidate>
      <Stack spacing={2}>
        <Typography fontWeight={400} variant="body1">{t(
          i18n
        )`This bank account will receive payments for your invoices`}</Typography>

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <FormSelect>
            <MoniteCountry
              name="country"
              control={control}
              disabled={countryOptions?.length === 1 || !!bankAccount}
              required
              fullWidth
              allowedCountries={
                componentSettings?.receivables?.bankAccountCountries
              }
              onChange={handleCountryChange}
            />
          </FormSelect>

          <FormSelect>
            <MoniteCurrency
              name="currency"
              control={control}
              required
              disabled={!!bankAccount}
              fullWidth
              shouldDisplayCustomList
            />
          </FormSelect>
        </Box>

        <Box display="flex" gap={2} width="100%">
          <Controller
            name="display_name"
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
            name="bank_name"
            control={control}
            disabled={!!bankAccount}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id={field.name}
                label={t(i18n)`Bank name`}
                variant="standard"
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                {...field}
              />
            )}
          />
        </Box>

        <BankAccountCustomFields
          currency={bankAccount?.currency ?? currency}
          defaultTypeOfCode={
            bankAccount?.routing_number ? 'routing_number' : 'sort_code'
          }
          control={control}
          disabled={!!bankAccount}
          setValue={setValue}
        />

        {!bankAccount?.is_default_for_currency &&
          filteredBanksByCurrency &&
          filteredBanksByCurrency?.length >= 1 && (
            <Box display="flex" alignItems="center" gap={2}>
              <Switch
                name="is_default_for_currency"
                checked={isDefaultForCurrency}
                onChange={(e) =>
                  setValue('is_default_for_currency', e.target.checked)
                }
                color="primary"
                aria-label={t(i18n)`Default currency switch`}
              />
              <Typography variant="body1">{t(
                i18n
              )`Set as default for this currency`}</Typography>
            </Box>
          )}
      </Stack>
    </form>
  );
};
