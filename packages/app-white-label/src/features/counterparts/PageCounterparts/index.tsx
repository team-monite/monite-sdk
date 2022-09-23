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
  const [counterpartId, setCounterpartId] = useState<string | undefined>(
    undefined
  );

  const [counterpartType, setCounterpartType] = useState<
    CounterpartType | undefined
  >(undefined);

  const onRowClick = (id: string) => {
    setCounterpartId(id);
  };

  const closeModal = () => {
    counterpartId && setCounterpartId(undefined);
    counterpartType && setCounterpartType(undefined);
  };

  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={[
          <Button
            key="1"
            onClick={() => setCounterpartType(CounterpartType.ORGANIZATION)}
          >
            Create New
          </Button>,
        ]}
      />
      <CounterpartsTable onRowClick={onRowClick} />
      {(counterpartId || counterpartType) && (
        <CounterpartDetails
          id={counterpartId}
          type={counterpartType}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
};

export default PageCounterparts;
