import { StoryObj } from '@storybook/react';

import { Onboarding as OnboardingComponent } from './Onboarding';

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
