import React from 'react';

import OnboardingLayout from './OnboardingLayout';
import OnboardingProgress from './OnboardingProgress';
import OnboardingFormActions from './OnboardingFormActions';
import { TextField } from '@mui/material';
import OnboardingContent from './OnboardingLayout/OnboardingContent';

export default function Onboarding() {
  return (
    <OnboardingLayout progress={<OnboardingProgress value={(1 / 7) * 100} />}>
      <OnboardingContent>
        <TextField id="test" fullWidth label="Test" variant="outlined" />
      </OnboardingContent>

      <OnboardingFormActions />
    </OnboardingLayout>
  );
}
