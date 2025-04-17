import { useEffect, useMemo } from 'react';

import { components } from '@/api';
import { useOnboardingBankAccount } from '@/components/onboarding/hooks/useOnboardingBankAccount';
import { getRegionName } from '@/components/onboarding/utils';
import {
  CountryOption,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MenuItem } from '@mui/material';

import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';

interface OnboardingBankAccountProps {
  allowedCurrencies?: CurrencyEnum[];
  allowedCountries?: AllowedCountries[];
}

export const OnboardingBankAccount = ({
  allowedCurrencies,
  allowedCountries,
}: OnboardingBankAccountProps) => {
  const { i18n } = useLingui();

  const {
    isLoading,
    isPending,
    countries,
    currencies,
    primaryAction,
    onboardingForm: {
      checkValue,
      handleSubmit,
      methods: { control, getValues, resetField, watch },
    },
  } = useOnboardingBankAccount();

  const country = watch('country');

  useEffect(() => {
    resetField('iban');
  }, [country, resetField]);

  useEffect(() => {
    const country = getValues('country');

    if (country && countries.length > 0 && !countries.includes(country)) {
      resetField('country');
    }
  }, [countries, resetField, getValues]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const result = await primaryAction(data);

    return result;
  });

  const filteredCurrencies = useMemo(() => {
    if (allowedCurrencies && allowedCurrencies.length > 0) {
      return currencies.filter((c) => allowedCurrencies.includes(c));
    }

    return currencies;
  }, [allowedCurrencies, currencies]);

  const filteredCountryOptions = useMemo(() => {
    const codesToUse =
      allowedCountries && allowedCountries.length > 0
        ? Object.values(countries).filter((code) =>
            allowedCountries.includes(code)
          )
        : Object.values(countries);

    return codesToUse.map((code) => ({
      code,
      label: t(i18n)`${getRegionName(code)}`,
    }));
  }, [allowedCountries, countries, i18n]);

  if (isLoading) return null;

  return (
    <OnboardingForm
      onSubmit={handleFormSubmit}
      actions={<OnboardingFormActions isLoading={isPending} />}
    >
      <OnboardingStepContent>
        {checkValue('currency') && !!filteredCurrencies.length && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`Currency`}
            name="currency"
            control={control}
            defaultValue={allowedCurrencies?.[0]}
            select
          >
            {filteredCurrencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </RHFTextField>
        )}

        {checkValue('country') && !!filteredCountryOptions.length && (
          <RHFAutocomplete
            disabled={isPending}
            name="country"
            control={control}
            defaultValue={allowedCountries?.[0]}
            label={t(i18n)`Country`}
            optionKey="code"
            labelKey="label"
            options={filteredCountryOptions}
            renderOption={(props, option, state) => (
              <CountryOption
                key={option.code}
                props={props}
                option={option}
                state={state}
              />
            )}
          />
        )}

        {checkValue('iban') && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`IBAN`}
            name="iban"
            control={control}
          />
        )}

        {checkValue('account_holder_name') && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`Account Holder Name`}
            name="account_holder_name"
            control={control}
          />
        )}

        {checkValue('account_number') && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`Account Number`}
            name="account_number"
            control={control}
          />
        )}

        {checkValue('routing_number') && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`Routing Number`}
            name="routing_number"
            control={control}
          />
        )}

        {checkValue('sort_code') && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`Sort Code`}
            name="sort_code"
            control={control}
          />
        )}
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
type AllowedCountries = components['schemas']['AllowedCountries'];
