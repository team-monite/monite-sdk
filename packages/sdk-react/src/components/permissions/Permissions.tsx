import { useState, useMemo } from 'react';

import { PageHeader } from '@/components';
import { ApprovalPoliciesTable } from '@/components/approvalPolicies';
import { UserRolesTable } from '@/components/userRoles';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
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

  const activeUITab = useMemo(() => {
    switch (activeTab) {
      case PermissionsTabEnum.UserRoles:
        return <UserRolesTable />;
      case PermissionsTabEnum.ApprovalPolicies:
        return <ApprovalPoliciesTable />;
    }
  }, [activeTab]);

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
            id={`permission-tab-${PermissionsTabEnum.UserRoles}`}
            label={t(i18n)`User roles`}
            area-control={`permission-tabpanel-${PermissionsTabEnum.UserRoles}`}
            value={PermissionsTabEnum.UserRoles}
          />
          <Tab
            id={`permission-tab-${PermissionsTabEnum.ApprovalPolicies}`}
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
