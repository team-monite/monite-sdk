import React from 'react';

import OnboardingStepContent from '../OnboardingLayout/OnboardingStepContent';
import { OnboardingFormProps } from '../hooks/useOnboardingForm';

const OnboardingSummary = (props: OnboardingFormProps) => {
  return (
    <OnboardingStepContent>
      <h1>Hooray!</h1>
    </OnboardingStepContent>
  );
};

export default OnboardingSummary;
