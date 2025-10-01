import { useOnboardingRequirementsData } from './useOnboarding';
import { useOnboardingRequirementsWithTreasury } from './useOnboardingWithTreasury';
import { useTreasuryEligibility } from '@/components/onboarding/hooks/useTreasuryEligibility';
import { useMemo } from 'react';

/**
 * Adapter hook that conditionally uses either the Treasury-enabled main endpoint
 * or the standard frontend endpoint based on Treasury eligibility.
 *
 * This provides a seamless transition layer while the frontend endpoint
 * is being fixed to include Treasury requirements.
 *
 * @param forceTreasuryEndpoint - Force use of Treasury endpoint for testing (optional)
 */
export const useOnboardingRequirementsAdapter = (
  forceTreasuryEndpoint = false
) => {
  const { isEligible, isLoading: treasuryEligibilityLoading } =
    useTreasuryEligibility();

  const shouldUseTreasuryAdapter = forceTreasuryEndpoint || isEligible;

  const frontendQuery = useOnboardingRequirementsData();
  const treasuryQuery = useOnboardingRequirementsWithTreasury();
  const activeQuery = shouldUseTreasuryAdapter ? treasuryQuery : frontendQuery;

  return useMemo(
    () => ({
      ...activeQuery,
      isLoading: activeQuery.isLoading || treasuryEligibilityLoading,
      meta: {
        usingTreasuryAdapter: shouldUseTreasuryAdapter,
        treasuryEligible: isEligible,
      },
    }),
    [
      activeQuery,
      treasuryEligibilityLoading,
      shouldUseTreasuryAdapter,
      isEligible,
    ]
  );
};

/**
 * Hook to force Treasury endpoint usage for testing purposes.
 * This bypasses the eligibility check and always uses the Treasury adapter.
 */
export const useOnboardingRequirementsWithForcedTreasury = () => {
  return useOnboardingRequirementsAdapter(true);
};
