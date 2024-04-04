import {
  ApiError,
  RoleResponse,
  RolePaginationResponse,
  RoleService,
  RoleServiceGetListRequestParams,
} from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const ROLES_QUERY_ID = 'roles';

const rolesQueryKeys = {
  all: () => [ROLES_QUERY_ID],
  detail: (roleId?: string) => [ROLES_QUERY_ID, roleId],
};

export const useRoles = (params: RoleServiceGetListRequestParams) => {
  const { monite } = useMoniteContext();

  return useQuery({
    queryKey: [...rolesQueryKeys.all(), { variables: params }],

    queryFn: () => monite.api.role.getList(params),
  });
};

export const useRoleById = (roleId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<RoleResponse | undefined, ApiError>({
    queryKey: [...rolesQueryKeys.detail(roleId)],

    queryFn: () => {
      if (!roleId) {
        throw new Error('Role ID is required');
      }
      return monite.api.role.getDetail(roleId);
    },

    enabled: !!roleId,
  });
};
