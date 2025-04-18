import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface UseUserRoleMutationsProps {
  onCreated?: (role: components['schemas']['RoleResponse']) => void;
  onUpdated?: (role: components['schemas']['RoleResponse']) => void;
  onDeleted?: () => void;
}

export const useUserRoleMutations = ({
  onCreated,
  onUpdated,
  onDeleted,
}: UseUserRoleMutationsProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  const roleCreateMutation = api.roles.postRoles.useMutation(
    {},
    {
      onSuccess: (role) =>
        Promise.all([
          api.roles.getRoles.invalidateQueries(queryClient),
          api.roles.getRolesId.invalidateQueries(
            { parameters: { path: { role_id: role.id } } },
            queryClient
          ),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );

  const roleUpdateMutation = api.roles.patchRolesId.useMutation(undefined, {
    onSuccess: (role) =>
      Promise.all([
        api.roles.getRoles.invalidateQueries(queryClient),
        api.roles.getRolesId.invalidateQueries(
          { parameters: { path: { role_id: role.id } } },
          queryClient
        ),
      ]),
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });

  const roleDeleteMutation = api.roles.deleteRolesId.useMutation(undefined, {
    onSuccess: (_, variables) => {
      const roleId = variables?.path.role_id;
      Promise.all([
        api.roles.getRoles.invalidateQueries(queryClient),
        api.roles.getRolesId.invalidateQueries(
          { parameters: { path: { role_id: roleId } } },
          queryClient
        ),
        api.entityUsers.getEntityUsers.invalidateQueries(
          { parameters: { query: { role_id: roleId } } },
          queryClient
        ),
      ]);
      toast.success(t(i18n)`Role has been deleted`);
    },
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });

  const createRole = (role: components['schemas']['CreateRoleRequest']) => {
    roleCreateMutation.mutate(
      { ...role },
      {
        onSuccess: (role) => {
          toast.success(t(i18n)`Role ${role.name} was created`);
          onCreated?.(role);
        },
      }
    );
  };

  const updateRole = (
    roleId: string,
    req: components['schemas']['UpdateRoleRequest']
  ) => {
    roleUpdateMutation.mutate(
      { path: { role_id: roleId }, body: req },
      {
        onSuccess: (role) => {
          toast.success(t(i18n)`Role ${role.name} was updated`);
          onUpdated?.(role);
        },
      }
    );
  };

  const deleteRole = (roleId: string) => {
    roleDeleteMutation.mutate(
      { path: { role_id: roleId } },
      {
        onSuccess: () => {
          onDeleted?.();
        },
      }
    );
  };

  return {
    createRole,
    updateRole,
    deleteRole,
    isCreating: roleCreateMutation.isPending,
    isUpdating: roleUpdateMutation.isPending,
    isDeleting: roleDeleteMutation.isPending,
  };
};

interface UseUserRoleQueryProps {
  id?: string;
}

export const useUserRoleQuery = ({ id }: UseUserRoleQueryProps) => {
  const { api } = useMoniteContext();

  const {
    isLoading: isLoadingRole,
    isPending: isPendingRole,
    data: roleData,
    error: roleQueryError,
  } = api.roles.getRolesId.useQuery(
    { path: { role_id: id ?? '' } },
    { enabled: !!id }
  );

  return {
    isLoadingRole,
    isPendingRole,
    roleData,
    roleQueryError,
  };
};
