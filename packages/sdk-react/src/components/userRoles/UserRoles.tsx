import { useState } from 'react';

import {
  Dialog,
  PageHeader,
  UserRoleDetails,
  UserRolesTable,
} from '@/components';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

export const UserRoles = () => (
  <MoniteScopedProviders>
    <UserRolesBase />
  </MoniteScopedProviders>
);

const UserRolesBase = () => {
  const { i18n } = useLingui();
  const [isRoleDetailsDialogOpened, setIsRoleDetailsDialogOpened] =
    useState(false);
  const [selectedUserRoleId, setSelectedUserRoleID] = useState<
    string | undefined
  >(undefined);
  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadRoleAllowed, isLoading: isReadRoleAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'read',
      entityUserId: user?.id,
    });
  const { data: isCreateRoleAllowed, isLoading: isCreateRoleAllowedLoading } =
    useIsActionAllowed({
      method: 'role',
      action: 'create',
      entityUserId: user?.id,
    });

  const onRoleRowClick = (id: string) => {
    setIsRoleDetailsDialogOpened(true);
    setSelectedUserRoleID(id);
  };

  const handleCreateNewRole = () => {
    setSelectedUserRoleID(undefined);
    setIsRoleDetailsDialogOpened(true);
  };

  return (
    <>
      <PageHeader
        title={t(i18n)`User Roles`}
        extra={
          <Button
            variant="contained"
            color="primary"
            disabled={isCreateRoleAllowedLoading || !isCreateRoleAllowed}
            onClick={handleCreateNewRole}
          >
            {t(i18n)`Create New`}
          </Button>
        }
      />

      {!isReadRoleAllowed && !isReadRoleAllowedLoading && <AccessRestriction />}
      {isReadRoleAllowed && (
        <UserRolesTable
          onRowClick={onRoleRowClick}
          handleCreateNew={handleCreateNewRole}
        />
      )}

      <Dialog
        open={isRoleDetailsDialogOpened}
        alignDialog="right"
        onClose={() => setIsRoleDetailsDialogOpened(false)}
      >
        <UserRoleDetails
          id={selectedUserRoleId}
          onCreated={(role) => setSelectedUserRoleID(role.id)}
        />
      </Dialog>
    </>
  );
};
