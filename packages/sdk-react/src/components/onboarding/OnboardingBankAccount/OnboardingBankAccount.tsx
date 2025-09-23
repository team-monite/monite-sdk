import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { components } from '@/api';
import { useOnboardingBankAccount } from '@/components/onboarding/hooks/useOnboardingBankAccount';
import { MoniteCountry } from '@/ui/Country';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MenuItem } from '@mui/material';
import { useEffect, useMemo } from 'react';

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
      methods: { control, getValues, resetField, setValue, watch, clearErrors },
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

    if (!country && countries.length === 1) {
      setValue('country', countries[0], {
        shouldDirty: false,
        shouldValidate: true,
      });
      clearErrors('country');
    }
  }, [countries, getValues, resetField, setValue, clearErrors]);

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

        {checkValue('country') && (
          <MoniteCountry
            name="country"
            control={control}
            disabled={isPending}
            defaultValue={countries.length === 1 ? countries[0] : undefined}
            allowedCountries={
              countries.length > 0 ? countries : allowedCountries
            }
            required
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
