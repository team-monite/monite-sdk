import { useMoniteContext } from '../context/MoniteContext';

export const usePatchEntitiesIdSettings = () => {
  const { api, monite } = useMoniteContext();

  return api.entities.patchEntitiesIdSettings.useMutation({
    path: {
      entity_id: monite.entityId,
    },
  });
};

export const useEntitySettings = (enabled = true) => {
  const { api, monite } = useMoniteContext();

  return api.entities.getEntitiesIdSettings.useQuery(
    {
      path: {
        entity_id: monite.entityId,
      },
    },
    { enabled }
  );
};
