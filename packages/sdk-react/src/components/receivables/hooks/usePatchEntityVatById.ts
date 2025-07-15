import { useMoniteContext } from '@/core/context/MoniteContext';

export const usePatchEntityVatById = (vatIdId: string) => {
  const { api, entityId, queryClient } = useMoniteContext();

  return api.entities.patchEntitiesIdVatIdsId.useMutation(
    {
      path: {
        entity_id: entityId,
        id: vatIdId,
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
