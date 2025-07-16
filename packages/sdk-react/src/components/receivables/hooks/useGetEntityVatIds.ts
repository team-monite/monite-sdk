import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetEntityVatIds = (entityId: string) => {
  const { api } = useMoniteContext();

  return api.entities.getEntitiesIdVatIds.useQuery(
    {
      path: {
        entity_id: entityId,
      },
    },
    {
      enabled: !!entityId,
    }
  );
};
