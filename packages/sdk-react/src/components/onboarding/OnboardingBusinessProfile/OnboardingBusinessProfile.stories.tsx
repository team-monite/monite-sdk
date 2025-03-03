import { StoryObj } from '@storybook/react';

import { OnboardingBusinessProfile } from './OnboardingBusinessProfile';

const Story = {
  title: 'Onboarding/Business Profile',
  component: OnboardingBusinessProfile,
};

type Story = StoryObj<typeof OnboardingBusinessProfile>;

export const OnboardingBusinessProfileStory: Story = {
  args: {},
  render: () => <OnboardingBusinessProfile />,
};

export default Story;
