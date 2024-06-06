import React from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRoleById } from '@/core/queries/useRoles';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { UserRoleDetailsDialog } from './UserRoleDetailsDialog';

interface UserRoleDetailsProps {
  /** User role ID */
  id?: string;
}

export const UserRoleDetails = (props: UserRoleDetailsProps) => (
  <MoniteScopedProviders>
    <UserRoleDetailsBase {...props} />
  </MoniteScopedProviders>
);

const UserRoleDetailsBase = ({ id }: UserRoleDetailsProps) => {
  const { i18n } = useLingui();
  const {
    isLoading,
    isPending,
    data: role,
    error: roleQueryError,
  } = useRoleById(id);

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

  return <UserRoleDetailsDialog id={id} />;
};
