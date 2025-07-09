import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetEntitySettings = (entityId: string) => {
  const { api } = useMoniteContext();

  return api.entities.getEntitiesIdSettings.useQuery(
    { path: { entity_id: entityId } },
    { enabled: !!entityId }
  );
};
