import { StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../context';
import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingCompleted } from './OnboardingCompleted';

const Story = {
  title: 'Onboarding/Completed',
  component: OnboardingCompleted,
};

type Story = StoryObj<typeof OnboardingCompleted>;

const StoryWrapper = (
  args: React.ComponentProps<typeof OnboardingCompleted>
) => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingCompleted {...args} />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

export const Completed: Story = {
  render: () => <StoryWrapper />,
};

export const CompletedWithContinueButton: Story = {
  render: () => (
    <StoryWrapper
      showContinueButton
      onContinue={() => console.log('onContinue')}
    />
  ),
};

export default Story;
