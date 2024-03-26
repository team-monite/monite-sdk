import { generateOptionalFields } from '@/components/onboarding/transformers';
import { onboardingBusinessProfileMixedFixture } from '@/components/onboarding/transformers/tests/bussinessProfile';
import { OnboardingOptionalParams } from '@/components/onboarding/types';
import { OnboardingBusinessProfile } from '@monite/sdk-api';

export const onboardingBusinessProfileFixture = (
  params?: OnboardingOptionalParams
): OnboardingBusinessProfile => {
  const businessProfile = onboardingBusinessProfileMixedFixture();

  return generateOptionalFields({
    fields: businessProfile.fields,
    ...params,
  });
};
