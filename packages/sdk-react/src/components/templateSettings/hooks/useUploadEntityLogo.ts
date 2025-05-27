import { useMoniteContext } from '@/core/context/MoniteContext';

export const useUploadEntityLogo = () => {
  const { api, queryClient } = useMoniteContext();

  return api.entities.putEntitiesIdLogo.useMutation(undefined, {
    onSuccess: () => {
      api.entityUsers.getEntityUsersMyEntity.invalidateQueries(queryClient);
    },
  });
};
