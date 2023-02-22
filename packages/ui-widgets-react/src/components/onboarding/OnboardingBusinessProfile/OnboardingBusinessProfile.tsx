import React from 'react';
import { useTranslation } from 'react-i18next';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

import RHFTextField from '../components/RHFTextField';
import OnboardingForm from '../OnboardingLayout/OnboardingForm';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';
import RHFAutocomplete from '../components/RHFAutocomplete';
import mcc from '../MCC.json';

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
        <RHFAutocomplete
          disabled={props.isLoading}
          name="business_profile.mcc"
          control={control}
          label={translateFields('mcc')}
          options={mcc}
          optionKey={'code'}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option?.name ?? ''
          }
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
