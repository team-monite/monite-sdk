import { useMoniteContext } from '@/core/context/MoniteContext';

export const useCreateEntityVatId = () => {
  const { api, entityId, queryClient } = useMoniteContext();

  return api.entities.postEntitiesIdVatIds.useMutation(
    {
      path: {
        entity_id: entityId,
      },
    },
    {
      onSuccess: () => {
        api.entities.getEntitiesIdVatIds.invalidateQueries(
          {
            parameters: {
              path: { entity_id: entityId },
            },
          },
          queryClient
        );
      },
    }
  );
};
