import { useEffect, useState, ComponentType } from 'react';

import { useOnboarding, useUpdateOnboarding } from 'core/queries/useOnboarding';
import {
  OnboardingBusinessType,
  OnboardingRequirement,
} from '@team-monite/sdk-api';

import OnboardingBusinessRepresentative from './OnboardingBusinessRepresentative';
import OnboardingEmpty from './OnboardingEmpty';
import OnboardingBankAccount from './OnboardingBankAccount';
import { OnboardingFormProps } from './hooks/useOnboardingForm';

export enum LocalRequirements {
  businessRepresentative = 'businessRepresentative',
  bankAccount = 'bankAccount',
  businessProfile = 'businessProfile',
  summary = 'summary',
}

const getLocalRequirements = (
  type: OnboardingBusinessType
): Partial<Record<LocalRequirements, OnboardingRequirement[]>> => {
  const { businessRepresentative, bankAccount, businessProfile, summary } =
    LocalRequirements;

  const { INDIVIDUAL, BANK_ACCOUNT, BUSINESS_PROFILE, TOS_ACCEPTANCE_DATE } =
    OnboardingRequirement;

  if (type === OnboardingBusinessType.INDIVIDUAL)
    return {
      [businessRepresentative]: [INDIVIDUAL],
      [bankAccount]: [BANK_ACCOUNT],
      [businessProfile]: [BUSINESS_PROFILE],
      [summary]: [TOS_ACCEPTANCE_DATE],
    };

  return {};
};

const componentList: Record<
  LocalRequirements,
  ComponentType<OnboardingFormProps>
> = {
  [LocalRequirements.businessRepresentative]: OnboardingBusinessRepresentative,
  [LocalRequirements.bankAccount]: OnboardingBankAccount,
  [LocalRequirements.businessProfile]: OnboardingEmpty,
  [LocalRequirements.summary]: OnboardingEmpty,
};

export type OnboardingProps = {
  linkId: string;
};

export const useOnboardingStep = ({ linkId }: OnboardingProps) => {
  const [length, setLength] = useState<number>(0);
  const [step, setStep] = useState<
    | {
        key: LocalRequirements;
        requirements: OnboardingRequirement[];
        index: number;
      }
    | undefined
  >(undefined);

  const { data: onboarding, isLoading } = useOnboarding(linkId);

  useEffect(() => window.scrollTo(0, 0), [step]);

  useEffect(() => {
    if (!onboarding) return;

    const localRequirements = getLocalRequirements(onboarding.business_type);
    const requirementsKeys = Object.keys(localRequirements);
    const requirementsEntries = Object.entries(localRequirements);

    setLength(requirementsKeys.length);

    const currentStep = requirementsEntries.find(([, localRequirements]) =>
      onboarding.requirements.find((requirement) =>
        localRequirements.find(
          (localRequirement) => localRequirement === requirement
        )
      )
    );

    if (currentStep) {
      const [key, requirements] = currentStep;

      setStep({
        key: key as LocalRequirements,
        index: requirementsKeys.indexOf(key),
        requirements,
      });
    }
  }, [onboarding]);

  const updateMutation = useUpdateOnboarding(linkId);

  return {
    isFirstStep: step?.index === 0,
    isLastStep: step?.index === length - 1,

    data: onboarding?.data,
    isLoading,
    progress: step ? ((step?.index + 1) / length) * 100 : 0,
    step,
    Component: step?.key && componentList[step.key],
    updateMutation,
  };
};
