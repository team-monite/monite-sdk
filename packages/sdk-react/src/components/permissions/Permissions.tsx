import { useState, useId, useEffect } from 'react';

import { PageHeader } from '@/components';
import { ApprovalPoliciesTable } from '@/components/approvalPolicies';
import { UserRolesTable } from '@/components/userRoles';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { TabPanel } from '@/ui/TabPanel';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Tabs, Tab, CircularProgress } from '@mui/material';

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

  useEffect(() => {
    if (!isReadRoleAllowedLoading && !isReadRoleAllowed) {
      setActiveTab(PermissionsTabEnum.ApprovalPolicies);
    }
  }, [isReadRoleAllowed, isReadRoleAllowedLoading]);

  return (
    <MoniteStyleProvider>
      <PageHeader
        title={
          <>
            {t(i18n)`Permissions`}
            {(isReadRoleAllowedLoading ||
              isReadApprovalPolicyAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
      />

      {!isReadRoleAllowed &&
        !isReadRoleAllowedLoading &&
        !isReadApprovalPolicyAllowed &&
        !isReadApprovalPolicyAllowedLoading && <AccessRestriction />}

      {(isReadRoleAllowed || isReadApprovalPolicyAllowed) &&
        !isReadRoleAllowedLoading &&
        !isReadApprovalPolicyAllowedLoading && (
          <>
            <Box sx={{ p: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                variant="standard"
                aria-label={t(i18n)`Permissions tabs`}
              >
                <Tab
                  label={t(i18n)`User roles`}
                  id={`permission-tab-${PermissionsTabEnum.UserRoles}-${tabId}`}
                  aria-controls={`permission-tabpanel-${PermissionsTabEnum.UserRoles}-${tabId}`}
                  disabled={isReadRoleAllowedLoading || !isReadRoleAllowed}
                />
                <Tab
                  label={t(i18n)`Approval Policies`}
                  id={`permission-tab-${PermissionsTabEnum.ApprovalPolicies}-${tabId}`}
                  aria-controls={`permission-tabpanel-${PermissionsTabEnum.ApprovalPolicies}-${tabId}`}
                  disabled={
                    isReadApprovalPolicyAllowedLoading ||
                    !isReadApprovalPolicyAllowed
                  }
                />
              </Tabs>
            </Box>
            <TabPanel
              value={activeTab}
              index={PermissionsTabEnum.UserRoles}
              id={`permission-tabpanel-${PermissionsTabEnum.UserRoles}-${tabId}`}
              aria-labelledby={`permission-tab-${PermissionsTabEnum.UserRoles}-${tabId}`}
            >
              {(() => {
                if (isReadRoleAllowed) {
                  return <UserRolesTable />;
                }
                return <AccessRestriction />;
              })()}
            </TabPanel>
            <TabPanel
              value={activeTab}
              index={PermissionsTabEnum.ApprovalPolicies}
              id={`permission-tabpanel-${PermissionsTabEnum.ApprovalPolicies}-${tabId}`}
              aria-labelledby={`permission-tab-${PermissionsTabEnum.ApprovalPolicies}-${tabId}`}
            >
              {(() => {
                if (isReadApprovalPolicyAllowed) {
                  return <ApprovalPoliciesTable />;
                }
                return <AccessRestriction />;
              })()}
            </TabPanel>
          </>
        )}
    </MoniteStyleProvider>
  );
};
