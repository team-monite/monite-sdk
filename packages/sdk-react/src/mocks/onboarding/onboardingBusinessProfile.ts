import { components } from '@/api';
import { generateOptionalFields } from '@/components/onboarding/transformers';
import { onboardingBusinessProfileMixedFixture } from '@/components/onboarding/transformers/tests/bussinessProfile';
import { OnboardingOptionalParams } from '@/components/onboarding/types';

export const onboardingBusinessProfileFixture = (
  params?: OnboardingOptionalParams
): components['schemas']['OnboardingBusinessProfile'] => {
  const businessProfile = onboardingBusinessProfileMixedFixture();

  return generateOptionalFields({
    fields: businessProfile.fields,
    ...params,
  });
};
