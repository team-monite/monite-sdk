import { ApiError, RoleResponse } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const ROLES_QUERY_ID = 'roles';

const rolesQueryKeys = {
  all: () => [ROLES_QUERY_ID],
  detail: (roleId: string) => [ROLES_QUERY_ID, roleId],
};

export const useRoleById = (roleId: string) => {
  const { monite } = useMoniteContext();

  return useQuery<RoleResponse | undefined, ApiError>(
    [...rolesQueryKeys.detail(roleId)],
    () => monite.api.role.getDetail(roleId)
  );
};
