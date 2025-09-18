import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingContextProvider } from '../context';
import { OnboardingAgreements } from './OnboardingAgreements';
import { StoryObj } from '@storybook/react-vite';

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
