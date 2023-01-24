import React from 'react';

import OnboardingLayout from './OnboardingLayout';
import OnboardingProgress from './OnboardingLayout/OnboardingProgress';
import OnboardingFormActions from './OnboardingFormActions';
import OnboardingBasicInformation from './OnboardingBasicInformation';

export default function Onboarding() {
  return (
    <OnboardingLayout progress={<OnboardingProgress value={(1 / 7) * 100} />}>
      <div>
        <OnboardingBasicInformation />
        <OnboardingFormActions />
      </div>
    </OnboardingLayout>
  );
}
