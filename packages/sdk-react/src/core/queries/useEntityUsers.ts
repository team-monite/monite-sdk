import { useMoniteContext } from '../context/MoniteContext';

export const useEntityUserById = (id: string | undefined) => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersId.useQuery(
    {
      path: { entity_user_id: id ?? '' },
    },
    {
      enabled: Boolean(id),
    }
  );
};

export const useEntityUserByAuthToken = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMe.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useEntityUserRoleByAuthToken = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMyRole.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};
