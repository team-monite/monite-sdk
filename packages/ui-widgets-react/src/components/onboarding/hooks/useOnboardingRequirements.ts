import { useEffect, useState } from 'react';

import {
  OnboardingBusinessType,
  OnboardingRequirement,
} from '@team-monite/sdk-api';

import {
  useOnboarding,
  useOnboardingRequirement,
} from 'core/queries/useOnboarding';

export enum LocalRequirements {
  businessRepresentative = 'businessRepresentative',
  bankAccount = 'bankAccount',
  businessProfile = 'businessProfile',
  review = 'review',
}

type RequirementType = {
  key: LocalRequirements;
  requirements: OnboardingRequirement[];
};

export const getLocalRequirements = (
  type?: OnboardingBusinessType
): RequirementType[] => {
  const { businessRepresentative, bankAccount, businessProfile, review } =
    LocalRequirements;

  const { INDIVIDUAL, BANK_ACCOUNT, BUSINESS_PROFILE, TOS_ACCEPTANCE_DATE } =
    OnboardingRequirement;

  if (type === OnboardingBusinessType.INDIVIDUAL)
    return [
      {
        key: businessRepresentative,
        requirements: [INDIVIDUAL],
      },
      {
        key: bankAccount,
        requirements: [BANK_ACCOUNT],
      },
      {
        key: businessProfile,
        requirements: [BUSINESS_PROFILE],
      },
      {
        key: review,
        requirements: [TOS_ACCEPTANCE_DATE],
      },
    ];

  return [];
};

export const useOnboardingRequirements = (linkId: string) => {
  const { data: onboarding, isLoading } = useOnboarding(linkId);
  const { data: currentRequirement } = useOnboardingRequirement();

  const [step, setStep] = useState<LocalRequirements | undefined>(undefined);

  const localRequirements = getLocalRequirements(onboarding?.business_type);

  const index = !!step
    ? localRequirements.findIndex(({ key }) => key === step)
    : 0;

  useEffect(() => window.scrollTo(0, 0), [step, currentRequirement]);

  useEffect(() => {
    setStep(() => {
      if (currentRequirement) return currentRequirement;

      const localRequirement = localRequirements.find(
        ({ key, requirements }) => {
          return requirements.find((requirement) =>
            onboarding?.requirements.includes(requirement)
          );
        }
      );

      if (!localRequirement) return undefined;

      return localRequirement.key;
    });
  }, [localRequirements, onboarding, currentRequirement]);

  const findRequirements = () =>
    localRequirements.reduce<OnboardingRequirement[]>(
      (acc, { key, requirements }) => {
        if (key === step) return [...acc, ...requirements];
        return acc;
      },
      []
    );

  const requirements = findRequirements();

  return {
    isLoading,
    isEditMode: !!currentRequirement,
    progress: ((index + 1) / localRequirements.length) * 100,
    step,
    index,
    requirements,
  };
};
