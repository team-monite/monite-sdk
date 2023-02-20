import React from 'react';

import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Loading, UArrowLeft } from '@team-monite/ui-kit-react';

import OnboardingLayout from './OnboardingLayout';
import OnboardingProgress from './OnboardingLayout/OnboardingProgress';
import OnboardingFormActions from './OnboardingFormActions';
import OnboardingTitle from './OnboardingLayout/OnboardingTitle';
import { OnboardingProps, useOnboardingStep } from './useOnboardingStep';

export default function Onboarding(props: OnboardingProps) {
  const { t } = useTranslation();

  const {
    step,
    isFirstStep,
    isLastStep,
    Component,
    progress,
    isLoading,
    data,
    updateMutation,
  } = useOnboardingStep(props);

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
            data={data}
            requirements={step.requirements}
            formKey={step.key}
            onSubmit={updateMutation.mutate}
            isLoading={updateMutation.isLoading}
          />
        )
      }
      actions={
        <OnboardingFormActions
          back={
            !isFirstStep &&
            !isLastStep && (
              <Button variant="contained" color="secondary">
                <UArrowLeft width={18} />
              </Button>
            )
          }
          next={
            !isLastStep && (
              <Button
                type={'submit'}
                form={step.key}
                variant="contained"
                color="primary"
              >
                {t('onboarding:actions.next')}
              </Button>
            )
          }
          save={
            <Button variant="contained" color="secondary">
              {t('onboarding:actions.save')}
            </Button>
          }
          submit={
            isLastStep && (
              <Button
                disabled={updateMutation.isLoading}
                variant="contained"
                color="primary"
              >
                {t('onboarding:actions.submit')}
              </Button>
            )
          }
        />
      }
    />
  );
}
