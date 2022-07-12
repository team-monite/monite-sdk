import React from 'react';
import { ApprovalPoliciesTable } from '@monite/react-kit';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import TestData from '@monite/react-kit/src/components/approvalPolicies/fixtures/list';

const PageApprovalPolicies = () => {
  return (
    <Layout>
      <PageHeader title="Approval Policies" />
      <ApprovalPoliciesTable data={TestData.data} />
    </Layout>
  );
};

export default PageApprovalPolicies;
