import React from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
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
      <OnboardingChildren />
    </MoniteScopedProviders>
  );
}

function OnboardingChildren() {
  const { isLoading, error } = useOnboardingRequirementsData();

  if (error) {
    return <div>{error.message}</div>;
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
