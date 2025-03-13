import type { FC } from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { useLingui } from '@lingui/react';
import { LinearProgress } from '@mui/material';

import { OnboardingContextProvider } from './context';
import { OnboardingContent } from './OnboardingContent';
import type { OnboardingProps } from './types';

/**
 * Onboarding component
 * @alpha
 * @description Onboarding component has not yet been released.
 */
export const Onboarding: FC<OnboardingProps> = (props) => {
  return (
    <MoniteScopedProviders>
      <OnboardingComponent {...props} />
    </MoniteScopedProviders>
  );
};

const OnboardingComponent: FC<OnboardingProps> = (props) => {
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
      <OnboardingContent {...props} />
    </OnboardingContextProvider>
  );
};
