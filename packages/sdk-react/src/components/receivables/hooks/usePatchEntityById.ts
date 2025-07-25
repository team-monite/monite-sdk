import { useMoniteContext } from '@/core/context/MoniteContext';

export const usePatchEntityById = () => {
  const { api, queryClient } = useMoniteContext();

  return api.entityUsers.patchEntityUsersMyEntity.useMutation(
    {},
    {
      onSuccess: () => {
        api.entityUsers.getEntityUsersMyEntity.invalidateQueries(queryClient);
      },
    }
  );
};
