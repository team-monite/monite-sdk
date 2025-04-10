import { StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../context';
import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingAgreements } from './OnboardingAgreements';

const Story = {
  title: 'Onboarding/Agreements',
  component: OnboardingAgreements,
};

type Story = StoryObj<typeof OnboardingAgreements>;

const StoryWrapper = () => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingAgreements />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

export const Agreements: Story = {
  render: () => <StoryWrapper />,
};

export default Story;
