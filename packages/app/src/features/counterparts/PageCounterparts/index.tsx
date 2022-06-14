import React from 'react';
import { CounterpartsTable, Button } from '@monite/react-kit';
import { useNavigate } from 'react-router-dom';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import CounterpartsTestData from 'tests/fixtures/counterparts';
import { ROUTES } from 'features/app/App';

const PageCounterparts = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={[
          <Button key="1" onClick={() => navigate(ROUTES.counterpartsCreate)}>
            Create New
          </Button>,
        ]}
      />
      <CounterpartsTable data={CounterpartsTestData} />
    </Layout>
  );
};

export default PageCounterparts;
