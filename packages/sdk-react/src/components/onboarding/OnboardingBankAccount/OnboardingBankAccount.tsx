import React, { useEffect } from 'react';

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

export const OnboardingBankAccount = () => {
  const { i18n } = useLingui();

  const {
    isLoading,
    countries,
    currencies,
    primaryAction,
    onboardingForm: {
      checkValue,
      handleSubmit,
      methods: { control, getValues, resetField },
    },
  } = useOnboardingBankAccount();

  useEffect(() => {
    const country = getValues('country');

    if (country && countries.length > 0 && !countries.includes(country)) {
      resetField('country');
    }
  }, [countries, resetField, getValues]);

  return (
    <OnboardingForm
      onSubmit={handleSubmit(primaryAction)}
      actions={<OnboardingFormActions isLoading={isLoading} />}
    >
      <OnboardingStepContent>
        {checkValue('currency') && !!currencies.length && (
          <RHFTextField
            disabled={isLoading}
            label={t(i18n)`Currency`}
            name="currency"
            control={control}
            select
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </RHFTextField>
        )}

        {checkValue('country') && !!countries.length && (
          <RHFAutocomplete
            disabled={isLoading}
            name="country"
            control={control}
            label={t(i18n)`Country`}
            optionKey="code"
            labelKey="label"
            options={Object.values(countries).map((code) => ({
              code,
              label: t(i18n)`${getRegionName(code)}`,
            }))}
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
            disabled={isLoading}
            label={t(i18n)`IBAN`}
            name="iban"
            control={control}
          />
        )}

        {checkValue('account_holder_name') && (
          <RHFTextField
            disabled={isLoading}
            label={t(i18n)`Account Holder Name`}
            name="account_holder_name"
            control={control}
          />
        )}

        {checkValue('account_number') && (
          <RHFTextField
            disabled={isLoading}
            label={t(i18n)`Account Number`}
            name="account_number"
            control={control}
          />
        )}

        {checkValue('routing_number') && (
          <RHFTextField
            disabled={isLoading}
            label={t(i18n)`Routing Number`}
            name="routing_number"
            control={control}
          />
        )}

        {checkValue('sort_code') && (
          <RHFTextField
            disabled={isLoading}
            label={t(i18n)`Sort Code`}
            name="sort_code"
            control={control}
          />
        )}
      </OnboardingStepContent>
    </OnboardingForm>
  );
};
