import React from 'react';
import { useTranslation } from 'react-i18next';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';
import OnboardingSubTitle from '../OnboardingLayout/OnboardingSubTitle';
import OnboardingCountryOption from '../OnboardingLayout/OnboardingCountryOption';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';

import RHFTextField from '../components/RHFTextField';
import RHFAutocomplete from '../components/RHFAutocomplete';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';
import { countries } from '../Countries';

const OnboardingBusinessRepresentative = (props: OnboardingFormProps) => {
  const { t } = useTranslation();

  const {
    methods: { control, handleSubmit },
    onSubmit,
  } = useOnboardingForm(props);

  const { individual } = props.data;

  const translateIndividualFields = (key: string): string =>
    t(`onboarding:individualFields.${key}`);

  const translateAddressFields = (key: string): string =>
    t(`onboarding:addressFields.${key}`);

  const translateTitles = (key: string): string =>
    t(`onboarding:businessRepresentativeStep.${key}`);

  return (
    <OnboardingForm formKey={props.formKey} onSubmit={handleSubmit(onSubmit)}>
      <OnboardingStepContent>
        <OnboardingSubTitle>{translateTitles('legalName')}</OnboardingSubTitle>

        <RHFTextField
          disabled={props.isLoading}
          label={translateIndividualFields('first_name')}
          name="individual.first_name"
          control={control}
        />

        <RHFTextField
          disabled={props.isLoading}
          label={translateIndividualFields('last_name')}
          name="individual.last_name"
          control={control}
        />
      </OnboardingStepContent>

      <OnboardingStepContent>
        <RHFTextField
          disabled={props.isLoading}
          label={translateIndividualFields('email')}
          name="individual.email"
          type={'email'}
          control={control}
        />

        <RHFTextField
          disabled={props.isLoading}
          label={translateIndividualFields('phone')}
          name="individual.phone"
          type={'tel'}
          control={control}
        />

        <RHFTextField
          disabled={props.isLoading}
          label={translateIndividualFields('date_of_birth')}
          name="individual.date_of_birth"
          control={control}
          type={'tel'}
          placeholder={'MM / DD / YYYY'}
          maskProps={{
            mask: '00 / 00 / 0000',
          }}
        />
      </OnboardingStepContent>

      <OnboardingStepContent>
        <OnboardingSubTitle>
          {translateTitles('homeAddress')}
        </OnboardingSubTitle>

        <RHFAutocomplete
          disabled
          name="individual.address.country"
          control={control}
          label={translateAddressFields('country')}
          options={countries}
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
          label={translateAddressFields('line1')}
          name="individual.address.line1"
          control={control}
        />

        <RHFTextField
          disabled={props.isLoading}
          label={translateAddressFields('line2')}
          name="individual.address.line2"
          control={control}
        />

        <RHFTextField
          disabled={props.isLoading}
          label={translateAddressFields('city')}
          name="individual.address.city"
          control={control}
        />

        {individual?.address?.state !== undefined && (
          <RHFTextField
            disabled={props.isLoading}
            label={translateAddressFields('state')}
            name="individual.address.state"
            control={control}
          />
        )}

        <RHFTextField
          disabled={props.isLoading}
          type={'tel'}
          label={translateAddressFields('postal_code')}
          name="individual.address.postal_code"
          control={control}
        />
      </OnboardingStepContent>

      {(individual?.id_number !== undefined ||
        individual?.ssn_last_4 !== undefined) && (
        <OnboardingStepContent>
          <OnboardingSubTitle>
            {translateTitles('verifyIdentity')}
          </OnboardingSubTitle>

          {individual.ssn_last_4 !== undefined && (
            <RHFTextField
              disabled={props.isLoading}
              label={translateIndividualFields('ssn_last_4')}
              name="individual.ssn_last_4"
              control={control}
              type={'tel'}
              maskProps={{
                mask: '0000',
              }}
            />
          )}

          {individual.id_number !== undefined && (
            <RHFTextField
              disabled={props.isLoading}
              type={'tel'}
              label={translateIndividualFields('id_number')}
              name="individual.id_number"
              control={control}
            />
          )}
        </OnboardingStepContent>
      )}
    </OnboardingForm>
  );
};

export default OnboardingBusinessRepresentative;
