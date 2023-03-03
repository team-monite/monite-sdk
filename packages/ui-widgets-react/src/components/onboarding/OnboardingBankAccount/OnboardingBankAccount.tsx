import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';

import countries from '../dicts/countries';
import currencies from '../dicts/currencies';
import allowCountries from '../dicts/allowedCountries.json';

import RHFTextField from '../components/RHFTextField';
import RHFAutocomplete from '../components/RHFAutocomplete';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';
import OnboardingCountryOption from '../OnboardingLayout/OnboardingCountryOption';

import OnboardingAgreement from './OnboardingAgreement';
import OnboardingFormActions from '../OnboardingFormActions';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';

const OnboardingBankAccount = (props: OnboardingFormProps) => {
  const { t } = useTranslation();

  const {
    methods: { control, handleSubmit },
    onNext,
    onSave,
    isLoading,
  } = useOnboardingForm(props);

  const translateFields = (key: string): string =>
    t(`onboarding:bankAccountFields.${key}`);

  return (
    <OnboardingForm
      onSubmit={handleSubmit(onNext)}
      actions={<OnboardingFormActions isLoading={isLoading} onSave={onSave} />}
    >
      <OnboardingStepContent>
        <RHFTextField
          disabled={isLoading}
          label={translateFields('currency')}
          name="bank_account.currency"
          control={control}
          select
        >
          {currencies.map(({ label, code }) => (
            <MenuItem key={code} value={code}>
              {label}
            </MenuItem>
          ))}
        </RHFTextField>

        <RHFAutocomplete
          disabled={isLoading}
          name="bank_account.country"
          control={control}
          label={translateFields('country')}
          options={countries.filter((country) =>
            allowCountries.find((item) => item === country.code)
          )}
          optionKey={'code'}
          labelKey={'label'}
          renderOption={(props, option, state) => (
            <OnboardingCountryOption
              key={option.code}
              props={props}
              option={option}
              state={state}
            />
          )}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateFields('iban')}
          name="bank_account.iban"
          control={control}
        />
        <OnboardingAgreement />
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

export default OnboardingBankAccount;
