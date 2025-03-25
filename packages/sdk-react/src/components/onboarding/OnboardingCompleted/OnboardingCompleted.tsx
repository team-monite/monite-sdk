import { useEffect } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { OnboardingLayout, OnboardingTitle } from '../OnboardingLayout';

interface OnboardingCompletedProps {
  onComplete?: () => void;
}

export const OnboardingCompleted = ({
  onComplete,
}: OnboardingCompletedProps = {}) => {
  const { i18n } = useLingui();

  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <OnboardingLayout
      title={
        <OnboardingTitle
          icon={
            <CheckCircleIcon
              sx={{ color: 'success.light', fontSize: '2rem' }}
            />
          }
          title={t(i18n)`Onboarding Completed`}
          description={t(
            i18n
          )`Thank you for completing onboarding for payments services. We will now review the information submitted.`}
        />
      }
    />
  );
};
