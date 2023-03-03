import React from 'react';

import { useTranslation } from 'react-i18next';
import { Loading } from '@team-monite/ui-kit-react';

import OnboardingLayout from './OnboardingLayout';
import OnboardingProgress from './OnboardingLayout/OnboardingProgress';
import OnboardingTitle from './OnboardingLayout/OnboardingTitle';
import { OnboardingProps, useOnboardingStep } from './useOnboardingStep';

export default function Onboarding(props: OnboardingProps) {
  const { t } = useTranslation();

  const { step, Component, progress, isLoading, data } =
    useOnboardingStep(props);

  // TODO Add error handling
  if (isLoading || !step || !data) {
    return <Loading />;
  }

  return (
    <OnboardingLayout
      progress={<OnboardingProgress value={progress} />}
      title={
        <OnboardingTitle
          step={`${t('onboarding:step')} ${step.index + 1}`}
          title={t(`onboarding:${step.key}Step.title`)}
          description={t(`onboarding:${step.key}Step.description`)}
        />
      }
      content={
        Component && (
          <Component
            linkId={props.linkId}
            data={data}
            requirements={step.requirements}
          />
        )
      }
    />
  );
}
