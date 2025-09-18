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

export const useEntityUsersByIds = (ids: string[]) => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsers.useQuery(
    {
      query: { id__in: ids },
    },
    {
      enabled: ids.length > 0,
    }
  );
};
