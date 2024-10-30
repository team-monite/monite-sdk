import { generateOptionalFields } from '@/components/onboarding/transformers';
import { onboardingBusinessProfileMixedFixture } from '@/components/onboarding/transformers/tests/bussinessProfile';
import { OnboardingOptionalParams } from '@/components/onboarding/types';
import { components } from '@monite/sdk-api/src/api';

export const onboardingBusinessProfileFixture = (
  params?: OnboardingOptionalParams
): components['schemas']['OnboardingBusinessProfile'] => {
  const businessProfile = onboardingBusinessProfileMixedFixture();

  return generateOptionalFields({
    fields: businessProfile.fields,
    ...params,
  });
};
