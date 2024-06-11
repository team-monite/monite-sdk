import React, { useState } from 'react';

import { Dialog, PageHeader, UserRoleDetails } from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ActionEnum } from '@monite/sdk-api';
import { Button } from '@mui/material';

import { UserRolesTable } from './UserRolesTable';

export const UserRoles = () => (
  <MoniteScopedProviders>
    <UserRolesBase />
  </MoniteScopedProviders>
);

const UserRolesBase = () => {
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
  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: ActionEnum.CREATE,
      entityUserId: user?.id,
    });

  const onRowClick = (id: string) => {
    setIsDetailsDialogOpened(true);
    setSelectedUserRoleID(id);
  };

  return (
    <>
      <PageHeader
        title={t(i18n)`User Roles`}
        extra={
          <Button
            variant="contained"
            color="primary"
            disabled={isCreateAllowedLoading || !isCreateAllowed}
            onClick={() => {
              setSelectedUserRoleID(undefined);
              setIsDetailsDialogOpened(true);
            }}
          >
            {t(i18n)`Create New`}
          </Button>
        }
      />

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && <UserRolesTable onRowClick={onRowClick} />}

      <Dialog
        open={isDetailsDialogOpened}
        alignDialog="right"
        onClose={() => setIsDetailsDialogOpened(false)}
      >
        <UserRoleDetails
          id={selectedUserRoleId}
          onCreated={(role) => setSelectedUserRoleID(role.id)}
        />
      </Dialog>
    </>
  );
};
