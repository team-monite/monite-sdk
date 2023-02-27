import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

import RHFTextField from '../components/RHFTextField';
import OnboardingAgreement from '../OnboardingLayout/OnboardingAgreement';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';
import { countries } from '../Countries';
import AllowCountries from '../AllowedCountries.json';
import OnboardingCountryOption from '../OnboardingLayout/OnboardingCountryOption';
import RHFAutocomplete from '../components/RHFAutocomplete';

const OnboardingBankAccount = (props: OnboardingFormProps) => {
  const { t } = useTranslation();

  const {
    methods: { control, handleSubmit },
    onSubmit,
  } = useOnboardingForm(props);

  const translateFields = (key: string): string =>
    t(`onboarding:bankAccountFields.${key}`);

  return (
    <OnboardingForm formKey={props.formKey} onSubmit={handleSubmit(onSubmit)}>
      <OnboardingStepContent>
        <RHFTextField
          disabled={props.isLoading}
          label={translateFields('currency')}
          name="bank_account.currency"
          control={control}
          select
        >
          <MenuItem value={10}>Georgia</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </RHFTextField>

        <RHFAutocomplete
          disabled={props.isLoading}
          name="bank_account.country"
          control={control}
          label={translateFields('country')}
          options={countries.filter((country) =>
            AllowCountries.find((item) => item === country.code)
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
          disabled={props.isLoading}
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
