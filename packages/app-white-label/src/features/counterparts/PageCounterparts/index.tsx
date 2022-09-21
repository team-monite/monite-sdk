import React, { useState } from 'react';
import {
  CounterpartsTable,
  CounterpartDetails,
  Button,
} from '@monite/ui-widgets-react';
import { CounterpartType } from '@monite/sdk-api';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const PageCounterparts = () => {
  const [isCreateVisible, setCreateVisible] = useState<boolean>(false);

  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={[
          <Button key="1" onClick={() => setCreateVisible(true)}>
            Create New
          </Button>,
        ]}
      />
      <CounterpartsTable />
      {isCreateVisible && (
        <CounterpartDetails
          type={CounterpartType.ORGANIZATION}
          onClose={() => setCreateVisible(false)}
        />
      )}
    </Layout>
  );
};

export default PageCounterparts;
