import { StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../context';
import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingPerson } from './OnboardingPerson';

const Story = {
  title: 'Onboarding/Person',
  component: OnboardingPerson,
};

type Story = StoryObj<typeof OnboardingPerson>;

const StoryWrapper = () => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingPerson />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

export const NewPerson: Story = {
  render: () => <StoryWrapper />,
};

export default Story;
