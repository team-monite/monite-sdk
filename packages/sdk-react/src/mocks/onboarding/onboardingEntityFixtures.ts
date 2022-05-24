import { generateOptionalFields } from '@/components/onboarding/transformers';
import {
  onboardingEntityIndividualFixture,
  onboardingEntityOrganizationFixture,
} from '@/components/onboarding/transformers/tests/entity';
import { OnboardingOptionalParams } from '@/components/onboarding/types';
import { OnboardingEntity } from '@monite/sdk-api';

export const onboardingEntityFixture = (
  type: 'individual' | 'organization',
  params?: OnboardingOptionalParams
): OnboardingEntity => {
  const entity =
    type === 'individual'
      ? onboardingEntityIndividualFixture()
      : onboardingEntityOrganizationFixture();

  return generateOptionalFields({
    fields: entity.fields,
    ...params,
  });
};
