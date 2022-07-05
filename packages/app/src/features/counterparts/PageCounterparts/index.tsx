import React from 'react';
import { CounterpartsTable, Button } from '@monite/react-kit';
import { useNavigate } from 'react-router-dom';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import CounterpartsTestData from 'tests/fixtures/counterparts';
import { ROUTES } from 'features/app/consts';
import { useRootStore } from 'features/mobx';

const PageCounterparts = () => {
  const navigate = useNavigate();
  const rootStore = useRootStore();

  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={[
          <Button key="1" onClick={() => navigate(ROUTES.counterpartsCreate)}>
            Create New
          </Button>,
          <Button
            key="2"
            ml="4px"
            onClick={() => {
              rootStore.auth.logout();
            }}
          >
            Logout
          </Button>,
        ]}
      />
      <CounterpartsTable data={CounterpartsTestData} />
    </Layout>
  );
};

export default PageCounterparts;
