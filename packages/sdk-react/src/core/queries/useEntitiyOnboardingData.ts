import { useMoniteContext } from '@/core/context/MoniteContext';

export const useUpdateEntityOnboardingData = () => {
  const { monite, api } = useMoniteContext();

  return api.entities.patchEntitiesIdOnboardingData.useMutation({
    path: {
      entity_id: monite.entityId,
    },
  });
};
