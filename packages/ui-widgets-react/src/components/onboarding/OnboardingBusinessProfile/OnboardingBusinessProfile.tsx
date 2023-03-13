import React from 'react';
import { OnboardingBusinessProfile as OnboardingBusinessProfileType } from '@team-monite/sdk-api';

import mccCodes from '../dicts/mccCodes';

import RHFTextField from '../components/RHFTextField';
import RHFAutocomplete from '../components/RHFAutocomplete';

import OnboardingForm from '../OnboardingLayout/OnboardingForm';
import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';
import OnboardingFormActions from '../OnboardingLayout/OnboardingFormActions';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';
import useOnboardingTranslateField from '../hooks/useOnboardingTranslateField';

const OnboardingBusinessProfile = ({ linkId }: OnboardingFormProps) => {
  const {
    methods: { control, handleSubmit },
    isLoading,
    actions,
    submitLabel,
    submitAction,
  } = useOnboardingForm(linkId);

  const translateField =
    useOnboardingTranslateField<OnboardingBusinessProfileType>(
      'businessProfile'
    );

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
        <RHFAutocomplete
          disabled={isLoading}
          name="business_profile.mcc"
          control={control}
          label={translateField('mcc')}
          options={mccCodes}
          optionKey={'code'}
          labelKey={'label'}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateField('url')}
          name="business_profile.url"
          type={'url'}
          control={control}
        />
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

export default OnboardingBusinessProfile;
