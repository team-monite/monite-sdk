import { StoryObj } from '@storybook/react';

import { OnboardingContextProvider } from '../context';
import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingBankAccount } from './OnboardingBankAccount';

const Story = {
  title: 'Onboarding/Bank Account',
  component: OnboardingBankAccount,
};

type Story = StoryObj<typeof OnboardingBankAccount>;

const StoryWrapper = () => {
  return (
    <OnboardingContextProvider>
      <OnboardingStepContent>
        <OnboardingBankAccount />
      </OnboardingStepContent>
    </OnboardingContextProvider>
  );
};

export const BankAccount: Story = {
  render: () => <StoryWrapper />,
};

export default Story;
