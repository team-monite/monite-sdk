import React from 'react';

import { OnboardingAddress, OnboardingIndividual } from '@team-monite/sdk-api';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';
import OnboardingSubTitle from '../OnboardingLayout/OnboardingSubTitle';
import OnboardingCountryOption from '../OnboardingLayout/OnboardingCountryOption';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';
import OnboardingFormActions from '../OnboardingLayout/OnboardingFormActions';

import RHFTextField from '../components/RHFTextField';
import RHFAutocomplete from '../components/RHFAutocomplete';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';

import countries from '../dicts/countries';
import useOnboardingTranslateField from '../hooks/useOnboardingTranslateField';
import useOnboardingTranslateTitle from '../hooks/useOnboardingTranslateTitle';
import { LocalRequirements } from '../hooks/useOnboardingRequirements';

export default function OnboardingBusinessRepresentative({
  linkId,
}: OnboardingFormProps) {
  const {
    methods: { control, handleSubmit },
    isLoading,
    actions,
    submitAction,
    submitLabel,
    onboarding,
  } = useOnboardingForm(linkId);

  const individual = onboarding?.data?.individual;

  const translateTitle = useOnboardingTranslateTitle(
    LocalRequirements.businessRepresentative
  );

  const translateIndividualField =
    useOnboardingTranslateField<OnboardingIndividual>('individual');

  const translateAddressField =
    useOnboardingTranslateField<OnboardingAddress>('address');

  return (
    <OnboardingForm
      onSubmit={handleSubmit(submitAction)}
      actions={
        <OnboardingFormActions
          submitType={submitLabel}
          isLoading={isLoading}
          {...actions}
        />
      }
    >
      <OnboardingStepContent>
        <OnboardingSubTitle>{translateTitle('legalName')}</OnboardingSubTitle>

        <RHFTextField
          disabled={isLoading}
          label={translateIndividualField('first_name')}
          name="individual.first_name"
          control={control}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateIndividualField('last_name')}
          name="individual.last_name"
          control={control}
        />
      </OnboardingStepContent>

      <OnboardingStepContent>
        <RHFTextField
          disabled={isLoading}
          label={translateIndividualField('email')}
          name="individual.email"
          type={'email'}
          control={control}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateIndividualField('phone')}
          name="individual.phone"
          type={'tel'}
          control={control}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateIndividualField('date_of_birth')}
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
        <OnboardingSubTitle>{translateTitle('homeAddress')}</OnboardingSubTitle>

        <RHFAutocomplete
          name="individual.address.country"
          control={control}
          label={translateAddressField('country')}
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
          disabled={isLoading}
          label={translateAddressField('line1')}
          name="individual.address.line1"
          control={control}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateAddressField('line2')}
          name="individual.address.line2"
          control={control}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateAddressField('city')}
          name="individual.address.city"
          control={control}
        />

        {individual?.address?.state !== undefined && (
          <RHFTextField
            disabled={isLoading}
            label={translateAddressField('state')}
            name="individual.address.state"
            control={control}
          />
        )}

        <RHFTextField
          disabled={isLoading}
          type={'tel'}
          label={translateAddressField('postal_code')}
          name="individual.address.postal_code"
          control={control}
        />
      </OnboardingStepContent>

      {(individual?.id_number !== undefined ||
        individual?.ssn_last_4 !== undefined) && (
        <OnboardingStepContent>
          <OnboardingSubTitle>
            {translateTitle('verifyIdentity')}
          </OnboardingSubTitle>

          {individual.ssn_last_4 !== undefined && (
            <RHFTextField
              disabled={isLoading}
              label={translateIndividualField('ssn_last_4')}
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
              disabled={isLoading}
              type={'tel'}
              label={translateIndividualField('id_number')}
              name="individual.id_number"
              control={control}
            />
          )}
        </OnboardingStepContent>
      )}
    </OnboardingForm>
  );
}
