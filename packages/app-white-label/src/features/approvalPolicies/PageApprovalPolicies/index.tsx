import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ApprovalPoliciesTable,
  ApprovalPolicyCreate,
} from '@team-monite/ui-widgets-react';
import { Button, Sidebar } from '@team-monite/ui-kit-react';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import TestData from '@team-monite/ui-widgets-react/src/components/approvalPolicies/fixtures/list';

const PageApprovalPolicies = () => {
  const { t } = useTranslation();
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);

  return (
    <Layout>
      <PageHeader
        title={t('approvalPolicies:approvalPolicies')}
        extra={[
          <Button key="1" onClick={() => setSidebarIsOpen(true)}>
            {t('common:createNew')}
          </Button>,
        ]}
      />
      <ApprovalPoliciesTable data={TestData.data} />
      {sidebarIsOpen && (
        <Sidebar
          isOpen={sidebarIsOpen}
          onClickBackdrop={() => setSidebarIsOpen(false)}
        >
          <ApprovalPolicyCreate
            handleOnCancel={() => setSidebarIsOpen(false)}
          />
        </Sidebar>
      )}
    </Layout>
  );
};

export default PageApprovalPolicies;
