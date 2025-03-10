import { useState } from 'react';

import {
  Dialog,
  PageHeader,
  UserRoleDetailsDialog,
  UserRoleEditDialog,
} from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  const [isEditDialogOpened, setIsEditDialogOpened] = useState(false);
  const [selectedUserRoleId, setSelectedUserRoleID] = useState<
    string | undefined
  >(undefined);
  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'read',
      entityUserId: user?.id,
    });
  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'create',
      entityUserId: user?.id,
    });

  const onRowClick = (id: string) => {
    setIsDetailsDialogOpened(true);
    setSelectedUserRoleID(id);
  };

  const handleCreateNew = () => {
    setSelectedUserRoleID(undefined);
    setIsEditDialogOpened(true);
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
            onClick={handleCreateNew}
          >
            {t(i18n)`Create New`}
          </Button>
        }
      />

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <UserRolesTable
          onRowClick={onRowClick}
          handleCreateNew={handleCreateNew}
        />
      )}

      <Dialog
        open={isDetailsDialogOpened}
        alignDialog="right"
        onClose={() => setIsDetailsDialogOpened(false)}
      >
        <UserRoleDetailsDialog
          id={selectedUserRoleId}
          onClickEditRole={() => setIsEditDialogOpened(true)}
        />
      </Dialog>

      <Dialog
        fullScreen
        open={isEditDialogOpened}
        onClose={() => setIsEditDialogOpened(false)}
      >
        <UserRoleEditDialog
          id={selectedUserRoleId}
          onCreated={() => setIsEditDialogOpened(false)}
          onUpdated={() => setIsEditDialogOpened(false)}
        />
      </Dialog>
    </>
  );
};
