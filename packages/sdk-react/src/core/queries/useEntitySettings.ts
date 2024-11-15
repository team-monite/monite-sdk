import { useMoniteContext } from '../context/MoniteContext';

export const usePatchEntitiesIdSettings = () => {
  const { api, entityId } = useMoniteContext();

  return api.entities.patchEntitiesIdSettings.useMutation({
    path: {
      entity_id: entityId,
    },
  });
};

export const useEntitySettings = (enabled = true) => {
  const { api, entityId } = useMoniteContext();

  return api.entities.getEntitiesIdSettings.useQuery(
    {
      path: {
        entity_id: entityId,
      },
    },
    { enabled }
  );
};
