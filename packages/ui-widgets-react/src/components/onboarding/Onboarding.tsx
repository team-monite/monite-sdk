import React from 'react';

import { useTranslation } from 'react-i18next';
import { Loading } from '@team-monite/ui-kit-react';

import OnboardingLayout from './OnboardingLayout';
import OnboardingProgress from './OnboardingLayout/OnboardingProgress';
import OnboardingTitle from './OnboardingLayout/OnboardingTitle';
import { OnboardingProps, useOnboardingStep } from './useOnboardingStep';
import useOnboardingTranslateTitle from './hooks/useOnboardingTranslateTitle';

export default function Onboarding(props: OnboardingProps) {
  const { t } = useTranslation();

  const { step, Component, progress, isLoading, data } =
    useOnboardingStep(props);

  const translateTitle = useOnboardingTranslateTitle(step?.key);

  // TODO Add error handling
  if (isLoading || !step || !data) {
    return <Loading />;
  }

  return (
    <OnboardingLayout
      progress={<OnboardingProgress value={progress} />}
      title={
        <OnboardingTitle
          title={translateTitle('title')}
          description={translateTitle('description')}
          step={`${t('onboarding:step')} ${step.index + 1}`}
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
