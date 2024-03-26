import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiError,
  EntityUserPaginationResponse,
  EntityUserResponse,
  EntityUserService,
  RoleResponse,
} from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

export const ENTITY_USERS_QUERY_ID = 'entityUsers';

export const useEntityUsersList = (
  ...args: Parameters<EntityUserService['getList']>
) => {
  const { monite } = useMoniteContext();

  return useQuery<EntityUserPaginationResponse, ApiError>(
    [ENTITY_USERS_QUERY_ID, { variables: args }],
    () => monite.api.entityUser.getList(...args)
  );
};

export const useEntityUserById = (id?: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();

  return useQuery<EntityUserResponse | undefined, ApiError>(
    [ENTITY_USERS_QUERY_ID, id],
    () =>
      id
        ? monite.api.entityUser.getById(id)
        : Promise.reject(
            new Error(t(i18n)`Invalid id (${id}) for useEntityUserById query`)
          ),
    {
      enabled: Boolean(id),
    }
  );
};

export const useEntityUserByAuthToken = () => {
  const { monite } = useMoniteContext();

  return useQuery<EntityUserResponse | undefined, ApiError>(
    [ENTITY_USERS_QUERY_ID, 'me'],
    () => monite.api.entityUser.getMe(),
    {
      /** Re-fetch user rights every minute */
      refetchInterval: 60_000,
    }
  );
};

export const useEntityUserRoleByAuthToken = () => {
  const { monite } = useMoniteContext();

  return useQuery<RoleResponse | undefined, ApiError>(
    [ENTITY_USERS_QUERY_ID, 'my_role'],
    () => monite.api.entityUser.getMyRole(),
    {
      /** Re-fetch user rights every minute */
      refetchInterval: 60_000,
    }
  );
};
