import React, { useState } from 'react';

import { Dialog, PageHeader, UserRoleDetails } from '@/components';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ActionEnum } from '@monite/sdk-api';

import { UserRolesTable } from './UserRolesTable';

export const UserRoles = () => {
  const { i18n } = useLingui();
  const [isDetailsDialogOpened, setIsDetailsDialogOpened] = useState(false);
  const [selectedUserRoleId, setSelectedUserRoleID] = useState<
    string | undefined
  >(undefined);
  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });

  const onRowClick = (id: string) => {
    setIsDetailsDialogOpened(true);
    setSelectedUserRoleID(id);
  };

  return (
    <MoniteStyleProvider>
      <PageHeader title={t(i18n)`User Roles`} />

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && <UserRolesTable onRowClick={onRowClick} />}

      <Dialog
        open={isDetailsDialogOpened}
        alignDialog="right"
        onClose={() => setIsDetailsDialogOpened(false)}
      >
        <UserRoleDetails id={selectedUserRoleId} />
      </Dialog>
    </MoniteStyleProvider>
  );
};
