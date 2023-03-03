import React from 'react';
// import { useTranslation } from 'react-i18next';

import OnboardingForm from '../OnboardingLayout/OnboardingForm';
// import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';

import useOnboardingForm, {
  OnboardingFormProps,
} from '../hooks/useOnboardingForm';

import OnboardingFormActions from '../OnboardingFormActions';
// import OnboardingSubTitle from '../OnboardingLayout/OnboardingSubTitle';
// import { getLocalRequirements, LocalRequirements } from '../useOnboardingStep';

const OnboardingReview = (props: OnboardingFormProps) => {
  // const { t } = useTranslation();
  const { onSubmit, onSave, isLoading, onboarding } = useOnboardingForm(props);

  if (!onboarding) return null;

  // const list = Object.keys(
  //   getLocalRequirements(onboarding.business_type)
  // ).filter((key) => key !== LocalRequirements.review);
  //
  // const translateTitles = (key: string): string =>
  //   t(`onboarding:${key}Step.title`);

  // {list.map((key) => (
  //   <OnboardingStepContent key={key}>
  //     <OnboardingSubTitle>{translateTitles(key)}</OnboardingSubTitle>
  //   </OnboardingStepContent>
  // ))}

  return (
    <OnboardingForm
      actions={
        <OnboardingFormActions
          isLoading={isLoading}
          onSave={onSave}
          onSubmit={onSubmit}
        />
      }
    >
      <img src={'/steps.png'} alt="Steve Jobs" />
    </OnboardingForm>
  );
};

export default OnboardingReview;
