import { StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../context';
import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingCompleted } from './OnboardingCompleted';

const Story = {
  title: 'Onboarding/Completed',
  component: OnboardingCompleted,
};

type Story = StoryObj<typeof OnboardingCompleted>;

const StoryWrapper = () => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingCompleted />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

export const Completed: Story = {
  render: () => <StoryWrapper />,
};

export default Story;
