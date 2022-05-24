import React from 'react';
import { CounterpartsTable } from '@monite/react-kit';
import Button from 'features/ui/Button';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const PageCounterparts = () => {
  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={[
          <Button key="1" type="primary">
            Create New
          </Button>,
        ]}
      />
      <CounterpartsTable />
    </Layout>
  );
};

export default PageCounterparts;
