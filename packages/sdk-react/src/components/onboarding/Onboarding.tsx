import React from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { useLingui } from '@lingui/react';
import { LinearProgress } from '@mui/material';

import { OnboardingContextProvider } from './context';
import { OnboardingContent } from './OnboardingContent';

/**
 * Onboarding component
 * @alpha
 * @description Onboarding component has not yet been released.
 */
export function Onboarding() {
  return (
    <MoniteScopedProviders>
      <OnboardingComponent />
    </MoniteScopedProviders>
  );
}

function OnboardingComponent() {
  const { isLoading, error } = useOnboardingRequirementsData();
  const { i18n } = useLingui();

  if (error) {
    return <div>{getAPIErrorMessage(i18n, error)}</div>;
  }

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <OnboardingContextProvider>
      <OnboardingContent />
    </OnboardingContextProvider>
  );
}
