import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { useLingui } from '@lingui/react';
import { LinearProgress } from '@mui/material';

import { OnboardingContextProvider } from './context';
import { OnboardingContent } from './OnboardingContent';
import { OnboardingProps } from './types';

/**
 * Onboarding component
 * @description Onboarding component.
 */
export const Onboarding = (props: OnboardingProps) => {
  return (
    <MoniteScopedProviders>
      <OnboardingComponent {...props} />
    </MoniteScopedProviders>
  );
};

const OnboardingComponent = (props: OnboardingProps) => {
  const { isLoading, error } = useOnboardingRequirementsData();
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  if (error) {
    return <div>{getAPIErrorMessage(i18n, error)}</div>;
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <OnboardingContextProvider>
      <OnboardingContent {...componentSettings.onboarding} {...props} />
    </OnboardingContextProvider>
  );
};
