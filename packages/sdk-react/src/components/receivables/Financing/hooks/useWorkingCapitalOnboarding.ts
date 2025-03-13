import { useEffect } from 'react';
import { usePrevious } from 'react-use';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useGetFinanceOffers } from '@/core/queries/useFinancing';

/**
 * Hook to monitor working capital onboarding status.
 * Triggers a callback when the business status transitions to 'ONBOARDED'.
 */
export const useWorkingCapitalOnboarding = (
  onWorkingCapitalOnboardingComplete?: (entityId: string) => void
) => {
  const { entityId } = useMoniteContext();
  const { data: financeOffersData } = useGetFinanceOffers();
  const prevBusinessStatus = usePrevious(financeOffersData?.business_status);

  useEffect(() => {
    if (
      financeOffersData?.business_status === 'ONBOARDED' &&
      prevBusinessStatus !== 'ONBOARDED'
    ) {
      onWorkingCapitalOnboardingComplete?.(entityId);
    }
  }, [
    financeOffersData?.business_status,
    prevBusinessStatus,
    onWorkingCapitalOnboardingComplete,
    entityId,
  ]);

  return {
    businessStatus: financeOffersData?.business_status,
    isOnboarded: financeOffersData?.business_status === 'ONBOARDED',
  };
};
