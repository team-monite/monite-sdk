import React, { ComponentType } from 'react';

import { useTranslation } from 'react-i18next';
import { Loading } from '@team-monite/ui-kit-react';

import OnboardingLayout from './OnboardingLayout';
import OnboardingProgress from './OnboardingLayout/OnboardingProgress';
import OnboardingTitle from './OnboardingLayout/OnboardingTitle';

import useOnboardingTranslateTitle from './hooks/useOnboardingTranslateTitle';
import { OnboardingFormProps } from './hooks/useOnboardingForm';
import {
  LocalRequirements,
  useOnboardingRequirements,
} from './hooks/useOnboardingRequirements';

import OnboardingBusinessRepresentative from './OnboardingBusinessRepresentative';
import OnboardingBankAccount from './OnboardingBankAccount';
import OnboardingBusinessProfile from './OnboardingBusinessProfile';
import OnboardingReview from './OnboardingReview';

const componentList: Record<
  LocalRequirements,
  ComponentType<OnboardingFormProps>
> = {
  [LocalRequirements.businessRepresentative]: OnboardingBusinessRepresentative,
  [LocalRequirements.bankAccount]: OnboardingBankAccount,
  [LocalRequirements.businessProfile]: OnboardingBusinessProfile,
  [LocalRequirements.review]: OnboardingReview,
};

export type OnboardingProps = {
  linkId: string;
};

export default function Onboarding({ linkId }: OnboardingProps) {
  const { t } = useTranslation();

  const { isLoading, progress, step, index, isEditMode } =
    useOnboardingRequirements(linkId);

  const translateTitle = useOnboardingTranslateTitle(step);

  // TODO Add error handling
  if (isLoading || !step) {
    return <Loading />;
  }

  const Step = componentList[step];

  return (
    <OnboardingLayout
      progress={!isEditMode && <OnboardingProgress value={progress} />}
      title={
        <OnboardingTitle
          title={translateTitle('title')}
          description={translateTitle('description')}
          step={`${t('onboarding:step')} ${index + 1}`}
        />
      }
      content={<Step linkId={linkId} />}
    />
  );
}
