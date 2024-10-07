import { useCallback, useId, useState } from 'react';

import { components } from '@/api';
import {
  ApprovalPolicyDetails,
  UserRoleDetails,
  UserRolesTable,
} from '@/components';
import { ApprovalPoliciesTable } from '@/components/approvalPolicies/ApprovalPoliciesTable';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, CircularProgress, Tab, Tabs } from '@mui/material';

/**
 * ApprovalPolicies component
 *
 * This component renders the user roles & approval policies page. It includes a table of approval policies,
 * a dialog for creating new approval policies,
 * and a header with a button for opening the create dialog.
 */
export const RolesAndApprovalPolicies = () => (
  <MoniteScopedProviders>
    <RolesAndApprovalPoliciesBase />
  </MoniteScopedProviders>
);

enum PageTabEnum {
  Roles,
  Policies,
}

const RolesAndApprovalPoliciesBase = () => {
  const { i18n } = useLingui();

  const [activeTab, setActiveTab] = useState<PageTabEnum>(PageTabEnum.Roles);

  const [selectedApprovalPolicyId, setSelectedApprovalPolicyId] = useState<
    string | undefined
  >(undefined);
  const [isCreatePolicyDialogOpened, setIsCreatePolicyDialogOpened] =
    useState<boolean>(false);

  const onPolicyRowClick = useCallback(
    (approvalPolicy: components['schemas']['ApprovalPolicyResource']) => {
      setSelectedApprovalPolicyId(approvalPolicy.id);
      setIsCreatePolicyDialogOpened(true);
    },
    []
  );

  const onCreatePolicyClick = useCallback(() => {
    setIsCreatePolicyDialogOpened(true);
    setSelectedApprovalPolicyId(undefined);
  }, []);

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadPolicyAllowed, isLoading: isReadPolicyAllowedLoading } =
    useIsActionAllowed({
      method: 'approval_policy',
      action: 'read',
      entityUserId: user?.id,
    });
  const {
    data: isCreatePolicyAllowed,
    isLoading: isCreatePolicyAllowedLoading,
  } = useIsActionAllowed({
    method: 'approval_policy',
    action: 'create',
    entityUserId: user?.id,
  });

  const [isRoleDetailsDialogOpened, setIsRoleDetailsDialogOpened] =
    useState(false);
  const [selectedUserRoleId, setSelectedUserRoleID] = useState<
    string | undefined
  >(undefined);
  // The following code duplicates state found in UserRoles.tsx and ApprovalPolicies.tsx
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

  const onCreateRoleClick = () => {
    setSelectedUserRoleID(undefined);
    setIsRoleDetailsDialogOpened(true);
  };

  const isRolesTab = activeTab == PageTabEnum.Roles;
  const isLoadingPermissions =
    isReadPolicyAllowedLoading ||
    isCreatePolicyAllowedLoading ||
    isReadRoleAllowedLoading ||
    isCreateRoleAllowedLoading;

  const isAccessRestricted =
    (isRolesTab && !isReadRoleAllowed && !isReadRoleAllowedLoading) ||
    (!isRolesTab && !isReadPolicyAllowed && !isReadPolicyAllowedLoading);
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabIdPrefix = `ReceivablesTable-Tab-${useId()}-`;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabPanelIdPrefix = `ReceivablesTable-TabPanel-${useId()}-`;
  const className = 'Monite-RolesAndPoliciesTable';

  return (
    <>
      <PageHeader
        title={
          <>
            {t(i18n)`Roles & Approvals`}
            {isLoadingPermissions && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <Box>
            <Button
              id="create"
              variant="contained"
              disabled={
                isRolesTab ? !isCreateRoleAllowed : !isCreatePolicyAllowed
              }
              onClick={isRolesTab ? onCreateRoleClick : onCreatePolicyClick}
            >{t(i18n)`Create`}</Button>
          </Box>
        }
      />

      <Box
        className={classNames(
          ScopedCssBaselineContainerClassName,
          className + '-Tabs'
        )}
      >
        <Tabs
          value={activeTab}
          variant="standard"
          aria-label={t(i18n)`Receivables tabs`}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            id={`${tabIdPrefix}-${PageTabEnum.Roles}`}
            aria-controls={`${tabPanelIdPrefix}-${PageTabEnum.Roles}`}
            label={t(i18n)`User roles`}
            value={PageTabEnum.Roles}
          />

          <Tab
            id={`${tabIdPrefix}-${PageTabEnum.Policies}`}
            aria-controls={`${tabPanelIdPrefix}-${PageTabEnum.Policies}`}
            label={t(i18n)`Approval policies`}
            value={PageTabEnum.Policies}
          />
        </Tabs>
      </Box>

      {isAccessRestricted && <AccessRestriction />}
      {!isRolesTab && isReadPolicyAllowed && (
        <ApprovalPoliciesTable
          onRowClick={onPolicyRowClick}
          onCreateClick={onCreatePolicyClick}
        />
      )}
      {isRolesTab && isReadRoleAllowed && (
        <UserRolesTable
          onRowClick={onRoleRowClick}
          handleCreateNew={onCreateRoleClick}
        />
      )}

      <Dialog
        open={isCreatePolicyDialogOpened}
        alignDialog="right"
        onClose={() => setIsCreatePolicyDialogOpened(false)}
      >
        <ApprovalPolicyDetails
          id={selectedApprovalPolicyId}
          onCreated={(id) => setSelectedApprovalPolicyId(id)}
        />
      </Dialog>

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
