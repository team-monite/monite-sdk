import { OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingContextProvider } from '../context';
import { OnboardingPerson } from './OnboardingPerson';
import { StoryObj } from '@storybook/react-vite';

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
