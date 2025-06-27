import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetEntityDocumentNumber = (entityId: string) => {
  const { api } = useMoniteContext();

  return api.entities.getEntitiesIdSettingsNextDocumentNumbers.useQuery(
    { path: { entity_id: entityId } },
    { enabled: !!entityId }
  );
};
