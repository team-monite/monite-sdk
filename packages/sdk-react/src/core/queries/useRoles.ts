import {
  ApiError,
  RoleResponse,
  RolePaginationResponse,
  RoleService,
} from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const ROLES_QUERY_ID = 'roles';

const rolesQueryKeys = {
  all: () => [ROLES_QUERY_ID],
  detail: (roleId: string) => [ROLES_QUERY_ID, roleId],
};

export const useRoles = (params: Parameters<RoleService['getList']>[0]) => {
  const { monite } = useMoniteContext();

  return useQuery<RolePaginationResponse, ApiError>(
    [...rolesQueryKeys.all(), { variables: params }],
    () => monite.api.role.getList(params)
  );
};

export const useRoleById = (roleId: string) => {
  const { monite } = useMoniteContext();

  return useQuery<RoleResponse | undefined, ApiError>(
    [...rolesQueryKeys.detail(roleId)],
    () => monite.api.role.getDetail(roleId)
  );
};
