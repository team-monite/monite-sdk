import React from 'react';

import { useRoleById } from '@/core/queries/useRoles';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { ExistingUserRoleDetails } from './ExistingUserRoleDetails';

interface UserRoleDetailsProps {
  /** User role ID */
  id?: string;
}

/** UserRoleDetails component
 *
 * This component renders the user role details.
 * It includes fields for the user role name and permissions.
 *
 */
export const UserRoleDetails = ({ id }: UserRoleDetailsProps) => {
  const { i18n } = useLingui();
  const {
    isLoading,
    isInitialLoading,
    data: role,
    error: roleQueryError,
  } = useRoleById(id);

  if (id && (isLoading || isInitialLoading)) {
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

  if (role) {
    return <ExistingUserRoleDetails role={role} />;
  }

  return null;
};
