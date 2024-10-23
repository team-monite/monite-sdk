import { useId, useState } from 'react';

import { ApprovalPoliciesTable, UserRolesTable } from '@/components';
import { ApprovalPoliciesTableProps } from '@/components/approvalPolicies/ApprovalPoliciesTable/ApprovalPoliciesTable';
import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Tab, Tabs } from '@mui/material';

interface RolesAndPoliciesTableProps {
  onRowClick?: Pick<
    ApprovalPoliciesTableProps,
    'onRowClick' | 'onCreateClick'
  >['onRowClick'];
  handleCreateNewRole?: () => void;
  handleCreateNewPolicy?: () => void;
}

export enum TableTabEnum {
  UserRoles,
  ApprovalPolicies,
}

export const RolesAndPoliciesTable = (props: RolesAndPoliciesTableProps) => (
  <MoniteScopedProviders>
    <RolesAndPoliciesTableBase {...props} />
  </MoniteScopedProviders>
);

const RolesAndPoliciesTableBase = ({
  onRowClick,
  handleCreateNewRole,
  handleCreateNewPolicy,
}: RolesAndPoliciesTableProps) => {
  const { i18n } = useLingui();
  const [activeTab, setActiveTab] = useState<TableTabEnum>(
    TableTabEnum.UserRoles
  );
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabIdPrefix = `RolesAndPoliciesTable-Tab-${useId()}-`;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const tabPanelIdPrefix = `RolesAndPoliciesTable-TabPanel-${useId()}-`;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const className = 'RolesAndPoliciesTable';

  return (
    <>
      <Box
        className={classNames(
          ScopedCssBaselineContainerClassName,
          className + '-Tabs'
        )}
      >
        <Tabs
          value={activeTab}
          variant="standard"
          aria-label={t(i18n)`Roles and Policies tabs`}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab
            id={`${tabIdPrefix}-${TableTabEnum.UserRoles}`}
            aria-controls={`${tabPanelIdPrefix}-${TableTabEnum.UserRoles}`}
            label={t(i18n)`User Roles`}
            value={TableTabEnum.UserRoles}
          />

          <Tab
            id={`${tabIdPrefix}-${TableTabEnum.ApprovalPolicies}`}
            aria-controls={`${tabPanelIdPrefix}-${TableTabEnum.ApprovalPolicies}`}
            label={t(i18n)`Approval Policies`}
            value={TableTabEnum.ApprovalPolicies}
          />
        </Tabs>
      </Box>

      {activeTab === TableTabEnum.UserRoles && (
        <Box
          role="tabpanel"
          id={`${tabPanelIdPrefix}-${TableTabEnum.UserRoles}`}
          aria-labelledby={`${tabIdPrefix}-${TableTabEnum.UserRoles}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <UserRolesTable handleCreateNew={handleCreateNewRole} />
        </Box>
      )}

      {activeTab === TableTabEnum.ApprovalPolicies && (
        <Box
          role="tabpanel"
          id={`${tabPanelIdPrefix}-${TableTabEnum.ApprovalPolicies}`}
          aria-labelledby={`${tabIdPrefix}-${TableTabEnum.ApprovalPolicies}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'inherit',
            minHeight: '0',
          }}
        >
          <ApprovalPoliciesTable
            onRowClick={onRowClick}
            onCreateClick={handleCreateNewPolicy}
          />
        </Box>
      )}
    </>
  );
};
