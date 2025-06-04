import { createContext, ReactNode, useContext } from 'react';

import {
  useOnboardingRequirements,
  type OnboardingRequirementsType,
} from '../hooks/useOnboardingRequirements';

const OnboardingRequirementsContext = createContext<OnboardingRequirementsType>(
  {} as OnboardingRequirementsType
);

type OnboardingContextProviderType = {
  children: ReactNode;
};

export const OnboardingContextProvider = ({
  children,
}: OnboardingContextProviderType) => {
  const requirements = useOnboardingRequirements();

  return (
    <OnboardingRequirementsContext.Provider value={requirements}>
      {children}
    </OnboardingRequirementsContext.Provider>
  );
};

export const useOnboardingRequirementsContext = () =>
  useContext(OnboardingRequirementsContext);
