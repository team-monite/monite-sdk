import React from 'react';
import { CounterpartsTable, Button } from '@monite/ui-widgets-react';
import { useNavigate } from 'react-router-dom';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import { ROUTES } from 'features/app/consts';

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
      <CounterpartsTable />
    </Layout>
  );
};

export default PageCounterparts;
