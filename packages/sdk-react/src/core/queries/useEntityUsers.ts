import { useMoniteContext } from '../context/MoniteContext';

export const ENTITY_USERS_QUERY_ID = 'entityUsers';

export const useEntityUserById = (id: string) => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersId.useQuery({
    path: {
      entity_user_id: id,
    },
  });
};

export const useEntityUserByAuthToken = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMe.useQuery(
    {},
    {
      refetchInterval: 60_000,
    }
  );
};

export const useEntityUserRoleByAuthToken = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMyRole.useQuery(
    {},
    {
      refetchInterval: 60_000,
    }
  );
};
