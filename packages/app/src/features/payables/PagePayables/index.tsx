import React from 'react';
import { PayablesTable } from '@monite/react-kit';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import TestData from '@monite/react-kit/src/components/payables/fixtures/list';

const PagePayables = () => {
  return (
    <Layout>
      <PageHeader title="Payables" />
      <PayablesTable data={TestData} />
    </Layout>
  );
};

export default PagePayables;
