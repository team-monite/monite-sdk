'use client';

import toast from 'react-hot-toast';

import { useEntityListCache, useEntityCache } from '@/core/queries/hooks';
import {
  commonPermissionsObjectType,
  payablePermissionsObjectType,
} from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ActionEnum,
  ApiError,
  CreateRoleRequest,
  PayableActionEnum,
  PermissionEnum,
  RoleResponse,
  RoleServiceGetListRequestParams,
  UpdateRoleRequest,
} from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const ROLES_QUERY_ID = 'roles';

interface RoleUpdateParams {
  roleId: string;
  payload: UpdateRoleRequest;
}

export interface UserRoleCommonPermissions {
  object_type: commonPermissionsObjectType;
  actions: {
    action_name: ActionEnum;
    permission: PermissionEnum;
  }[];
}

export interface UserRolePayablePermissions {
  object_type: payablePermissionsObjectType;
  actions: {
    action_name: PayableActionEnum;
    permission: PermissionEnum;
  }[];
}

export interface UserRoleRequest {
  name: string;
  permissions: {
    objects: (UserRolePayablePermissions | UserRoleCommonPermissions)[];
  };
}

const rolesQueryKeys = {
  all: () => [ROLES_QUERY_ID],
  detail: (roleId?: string) =>
    roleId
      ? [...rolesQueryKeys.all(), 'detail', roleId]
      : [...rolesQueryKeys.all(), 'detail'],
};

export const useRoleListCache = () =>
  useEntityListCache<RoleResponse>(rolesQueryKeys.all);
export const useRoleCache = (roleId?: string) =>
  useEntityCache<RoleResponse>(() => rolesQueryKeys.detail(roleId));

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
    queryKey: rolesQueryKeys.detail(roleId),

    queryFn: () => {
      if (!roleId) {
        throw new Error('Role ID is required');
      }
      return monite.api.role.getDetail(roleId);
    },

    enabled: !!roleId,
  });
};

export const useCreateRole = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useRoleListCache();
  const { setEntity: setRole, removeEntity: removeRole } = useRoleCache();

  return useMutation<RoleResponse, Error, CreateRoleRequest>({
    mutationFn: (payload) => monite.api.role.create(payload),

    onSuccess: (role) => {
      setRole(role);
      invalidate();
      removeRole(role.id);

      toast.success(t(i18n)`Role ${role.name} was created`);
    },
  });
};

export const useUpdateRole = (id?: string) => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useRoleListCache();
  const { setEntity: setRole, removeEntity: removeRole } = useRoleCache(id);

  return useMutation<RoleResponse, Error, RoleUpdateParams>({
    mutationFn: ({ roleId, payload }) =>
      monite.api.role.update(roleId, payload),

    onSuccess: (role) => {
      setRole(role);
      invalidate();
      removeRole(role.id);

      toast.success(t(i18n)`Role updated`);
    },
  });
};
