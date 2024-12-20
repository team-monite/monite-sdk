import { useMoniteContext } from '@/core/context/MoniteContext';

export const useUpdateEntityOnboardingData = () => {
  const { entityId, api } = useMoniteContext();

  return api.entities.patchEntitiesIdOnboardingData.useMutation({
    path: {
      entity_id: entityId,
    },
  });
};
