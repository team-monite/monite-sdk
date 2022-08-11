import React from 'react';
import { PayablesTableWithAPI } from '@monite/react-kit';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const PagePayables = () => {
  return (
    <Layout>
      <PageHeader title="Payables" />
      <PayablesTableWithAPI />
    </Layout>
  );
};

export default PagePayables;
