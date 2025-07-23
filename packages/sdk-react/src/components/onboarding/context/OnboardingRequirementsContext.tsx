import { useOnboardingRequirements } from '../hooks/useOnboardingRequirements';
import type { OnboardingRequirementsType } from '../hooks/useOnboardingRequirements';
import { createContext, ReactNode, useContext } from 'react';

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
