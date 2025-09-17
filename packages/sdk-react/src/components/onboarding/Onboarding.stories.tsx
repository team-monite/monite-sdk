import { Onboarding as OnboardingComponent } from './Onboarding';
import { StoryObj } from '@storybook/react-vite';

const Story = {
  title: 'Onboarding',
  component: OnboardingComponent,
};

type Story = StoryObj<typeof OnboardingComponent>;

export const Onboarding: Story = {
  args: {},
  render: () => <OnboardingComponent />,
};

export default Story;
