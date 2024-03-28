import React from 'react';

import { useRoleById } from '@/core/queries/useRoles';
import { LoadingPage } from '@/ui/loadingPage';

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
  const { isLoading, isInitialLoading, data: role } = useRoleById(id);

  if (id && (isLoading || isInitialLoading)) {
    return <LoadingPage />;
  }

  if (role) {
    return <ExistingUserRoleDetails role={role} />;
  }

  return null;
};
