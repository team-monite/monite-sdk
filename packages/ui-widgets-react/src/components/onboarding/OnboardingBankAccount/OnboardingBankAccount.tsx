import React from 'react';
import { MenuItem } from '@mui/material';
import { OnboardingBankAccount as OnboardingBankAccountType } from '@team-monite/sdk-api';

import countries from '../dicts/countries';
import currencies from '../dicts/currencies';
import allowCountries from '../dicts/allowedCountries.json';

import RHFTextField from '../components/RHFTextField';
import RHFAutocomplete from '../components/RHFAutocomplete';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';
import OnboardingCountryOption from '../OnboardingLayout/OnboardingCountryOption';
import OnboardingFormActions from '../OnboardingLayout/OnboardingFormActions';

import OnboardingAgreement from './OnboardingAgreement';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';
import useOnboardingTranslateField from '../hooks/useOnboardingTranslateField';

const OnboardingBankAccount = ({ linkId }: OnboardingFormProps) => {
  const {
    methods: { control, handleSubmit },
    actions,
    submitAction,
    submitLabel,
    isLoading,
  } = useOnboardingForm(linkId);

  const translateField =
    useOnboardingTranslateField<OnboardingBankAccountType>('bankAccount');

  return (
    <OnboardingForm
      onSubmit={handleSubmit(submitAction)}
      actions={
        <OnboardingFormActions
          submitLabel={submitLabel}
          isLoading={isLoading}
          {...actions}
        />
      }
    >
      <OnboardingStepContent>
        <RHFTextField
          disabled={isLoading}
          label={translateField('currency')}
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
          label={translateField('country')}
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
          label={translateField('iban')}
          name="bank_account.iban"
          control={control}
        />
        <OnboardingAgreement />
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

export default OnboardingBankAccount;
