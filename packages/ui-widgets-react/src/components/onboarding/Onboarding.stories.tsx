import { ComponentStory } from '@storybook/react';

import Onboarding from './Onboarding';
import { OnboardingProps } from './useOnboardingStep';
import { OnboardingBusinessTypeFixture } from '../../mocks';

const Story = {
  title: 'Onboarding/Onboarding',
  component: Onboarding,
};

export default Story;

const OnboardingTemplate: ComponentStory<typeof Onboarding> = ({
  ...props
}: OnboardingProps) => <Onboarding {...props} />;

export const OnboardingStory = () => {
  const fakeLinkId = JSON.stringify({
    type: OnboardingBusinessTypeFixture.emptyIndividual,
  });

  return <OnboardingTemplate linkId={fakeLinkId} />;
};
