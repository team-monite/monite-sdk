import React from 'react';
import { useTranslation } from 'react-i18next';

import RHFTextField from '../components/RHFTextField';
import RHFAutocomplete from '../components/RHFAutocomplete';

import OnboardingForm from '../OnboardingLayout/OnboardingForm';
import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

import mccCodes from '../dicts/mccCodes';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';
import OnboardingFormActions from '../OnboardingFormActions';

const OnboardingBusinessProfile = (props: OnboardingFormProps) => {
  const { t } = useTranslation();

  const {
    methods: { control, handleSubmit },
    isLoading,
    onNext,
    onSave,
  } = useOnboardingForm(props);

  const translateFields = (key: string): string =>
    t(`onboarding:businessProfileFields.${key}`);

  return (
    <OnboardingForm
      onSubmit={handleSubmit(onNext)}
      actions={<OnboardingFormActions isLoading={isLoading} onSave={onSave} />}
    >
      <OnboardingStepContent>
        <RHFAutocomplete
          disabled={isLoading}
          name="business_profile.mcc"
          control={control}
          label={translateFields('mcc')}
          options={mccCodes}
          optionKey={'code'}
          labelKey={'label'}
        />

        <RHFTextField
          disabled={isLoading}
          label={translateFields('url')}
          name="business_profile.url"
          type={'url'}
          control={control}
        />
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

export default OnboardingBusinessProfile;
