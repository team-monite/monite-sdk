import { useEffect } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

import { OnboardingLayout, OnboardingTitle } from '../OnboardingLayout';

export interface OnboardingCompletedProps {
  onComplete?: () => void;
  onContinue?: () => void;
  showContinueButton?: boolean;
}

export const OnboardingCompleted = ({
  onComplete,
  onContinue,
  showContinueButton = false,
}: OnboardingCompletedProps = {}) => {
  const { i18n } = useLingui();

  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <OnboardingLayout
      title={
        <OnboardingTitle
          title={t(i18n)`Onboarding completed!`}
          description={t(
            i18n
          )`Thank you for completing onboarding for payments services. We will review the information submitted, and notify you when complete.`}
        />
      }
      content={
        showContinueButton && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onContinue}
          >
            {t(i18n)`Continue`}
          </Button>
        )
      }
    />
  );
};
