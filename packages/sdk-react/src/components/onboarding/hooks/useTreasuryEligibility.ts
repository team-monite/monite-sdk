import { isTreasuryEligible } from '../utils/treasuryEligibility';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';

/**
 * Hook to check if the current entity is eligible for Treasury onboarding
 */
export function useTreasuryEligibility() {
  const { api, entityId } = useMoniteContext();
  const { data: entity, isLoading: isLoadingEntity } = useMyEntity();

  const { data: paymentMethodsResponse, isLoading: isLoadingPaymentMethods } =
    api.entities.getEntitiesIdPaymentMethods.useQuery(
      {
        path: { entity_id: entityId },
      },
      {
        enabled: !!entityId,
      }
    );

  const isLoading = isLoadingEntity || isLoadingPaymentMethods;
  const isEligible = isTreasuryEligible(entity, paymentMethodsResponse?.data);

  return {
    isLoading,
    isEligible,
    entity,
    paymentMethods: paymentMethodsResponse?.data,
  };
}
