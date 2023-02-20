import React from 'react';
import { useTranslation } from 'react-i18next';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

import RHFTextField from '../components/RHFTextField';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';

const OnboardingBusinessProfile = (props: OnboardingFormProps) => {
  const { t } = useTranslation();

  const {
    methods: { control, handleSubmit },
    onSubmit,
  } = useOnboardingForm(props);

  const translateFields = (key: string): string =>
    t(`onboarding:businessProfileFields.${key}`);

  return (
    <OnboardingForm formKey={props.formKey} onSubmit={handleSubmit(onSubmit)}>
      <OnboardingStepContent>
        <RHFTextField
          disabled={props.isLoading}
          label={translateFields('mcc')}
          name="business_profile.mcc"
          control={control}
        />
        <RHFTextField
          disabled={props.isLoading}
          label={translateFields('url')}
          name="business_profile.url"
          control={control}
        />
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

export default OnboardingBusinessProfile;
