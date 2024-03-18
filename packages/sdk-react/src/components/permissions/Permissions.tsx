import { useState, useMemo, useId } from 'react';

import { PageHeader } from '@/components';
import { ApprovalPoliciesTable } from '@/components/approvalPolicies';
import { UserRolesTable } from '@/components/userRoles';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { LoadingPage } from '@/ui/loadingPage';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Tabs, Tab } from '@mui/material';

enum PermissionsTabEnum {
  UserRoles,
  ApprovalPolicies,
}
export const Permissions = () => {
  const { i18n } = useLingui();
  const [activeTab, setActiveTab] = useState<PermissionsTabEnum>(
    PermissionsTabEnum.UserRoles
  );
  const tabId = useId();
  const { data: user } = useEntityUserByAuthToken();
  const {
    data: isReadRoleAllowed,
    isInitialLoading: isReadRoleAllowedLoading,
  } = useIsActionAllowed({
    method: 'role',
    action: ActionEnum.READ,
    entityUserId: user?.id,
  });
  const {
    data: isReadApprovalPolicyAllowed,
    isInitialLoading: isReadApprovalPolicyAllowedLoading,
  } = useIsActionAllowed({
    method: 'approval_policy',
    action: ActionEnum.READ,
    entityUserId: user?.id,
  });

  const activeUITab = useMemo(() => {
    switch (activeTab) {
      case PermissionsTabEnum.UserRoles:
        if (isReadRoleAllowedLoading) {
          return <LoadingPage />;
        }

        if (!isReadRoleAllowed) {
          return <AccessRestriction />;
        }
        return <UserRolesTable />;
      case PermissionsTabEnum.ApprovalPolicies:
        if (isReadApprovalPolicyAllowedLoading) {
          return <LoadingPage />;
        }

        if (!isReadApprovalPolicyAllowed) {
          return <AccessRestriction />;
        }

        return <ApprovalPoliciesTable />;
    }
  }, [
    activeTab,
    isReadApprovalPolicyAllowed,
    isReadApprovalPolicyAllowedLoading,
    isReadRoleAllowed,
    isReadRoleAllowedLoading,
  ]);

  return (
    <MoniteStyleProvider>
      <PageHeader title={t(i18n)`Permissions`} />
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        <Tabs
          value={activeTab}
          variant="standard"
          aria-label={t(i18n)`Permissions tabs`}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            id={`permission-tab-${PermissionsTabEnum.UserRoles}-${tabId}`}
            label={t(i18n)`User roles`}
            area-control={`permission-tabpanel-${PermissionsTabEnum.UserRoles}`}
            value={PermissionsTabEnum.UserRoles}
          />
          <Tab
            id={`permission-tab-${PermissionsTabEnum.ApprovalPolicies}-${tabId}`}
            label={t(i18n)`Approval Policies`}
            area-control={`permission-tabpanel-${PermissionsTabEnum.ApprovalPolicies}`}
            value={PermissionsTabEnum.ApprovalPolicies}
          />
        </Tabs>
      </Box>
      {activeUITab}
    </MoniteStyleProvider>
  );
};
