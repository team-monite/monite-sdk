import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { UserRoleDetailsDialog } from './UserRoleDetailsDialog';

export interface UserRoleDetailsProps {
  /** The id of the role to be displayed */
  id?: string;

  /**
   * Callback is fired when a role is created and sync with server is successful
   *
   * @param role
   */
  onCreated?: (role: components['schemas']['RoleResponse']) => void;

  /**
   * Callback is fired when a role is updated and sync with server is successful
   *
   * @param role
   */
  onUpdated?: (role: components['schemas']['RoleResponse']) => void;
}

export const UserRoleDetails = (props: UserRoleDetailsProps) => (
  <MoniteScopedProviders>
    <UserRoleDetailsBase {...props} />
  </MoniteScopedProviders>
);

const UserRoleDetailsBase = ({
  id,
  onUpdated,
  onCreated,
}: UserRoleDetailsProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const {
    isLoading,
    isPending,
    data: role,
    error: roleQueryError,
  } = api.roles.getRolesId.useQuery(
    { path: { role_id: id ?? '' } },
    { enabled: !!id }
  );

  if (id && (isLoading || isPending)) {
    return <LoadingPage />;
  }

  if (roleQueryError) {
    return (
      <NotFound
        title={t(i18n)`Role not found`}
        description={t(i18n)`There is no role by provided id: ${id}`}
      />
    );
  }

  return (
    <UserRoleDetailsDialog
      role={role}
      onUpdated={onUpdated}
      onCreated={onCreated}
    />
  );
};
