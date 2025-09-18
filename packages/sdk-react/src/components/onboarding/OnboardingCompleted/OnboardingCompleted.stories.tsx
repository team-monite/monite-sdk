import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingContextProvider } from '../context';
import { OnboardingCompleted } from './OnboardingCompleted';
import { StoryObj } from '@storybook/react-vite';

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
