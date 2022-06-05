import React from 'react';
import { CounterpartsTable, Button } from '@monite/react-kit';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import CounterpartsTestData from 'tests/fixtures/counterparts';

const PageCounterparts = () => {
  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={[<Button key="1">Create New</Button>]}
      />
      <CounterpartsTable data={CounterpartsTestData} />
    </Layout>
  );
};

export default PageCounterparts;
