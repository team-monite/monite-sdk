import React, { useCallback, useState } from 'react';
import {
  CounterpartsTable,
  CounterpartDetails,
  Button,
} from '@team-monite/ui-widgets-react';
import { CounterpartType } from '@team-monite/sdk-api';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import { Dropdown, DropdownMenuItem } from '@team-monite/ui-kit-react';

const PageCounterparts = () => {
  const [counterpartId, setId] = useState<string | undefined>(undefined);

  const [counterpartType, setType] = useState<CounterpartType | undefined>(
    undefined
  );

  const closeModal = useCallback(() => {
    counterpartId && setId(undefined);
    counterpartType && setType(undefined);
  }, [counterpartId, counterpartType]);

  const setCounterpartType = useCallback((type: CounterpartType) => {
    setType(type);
  }, []);

  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={
          <Dropdown button={<Button>Create New</Button>}>
            <DropdownMenuItem onClick={setCounterpartType}>
              Organization
            </DropdownMenuItem>
            <DropdownMenuItem onClick={setCounterpartType}>
              Individual
            </DropdownMenuItem>
          </Dropdown>
        }
      />

      <CounterpartsTable onRowClick={setId} />
      {(counterpartId || counterpartType) && (
        <CounterpartDetails
          id={counterpartId}
          type={counterpartType}
          onClose={closeModal}
          onDelete={closeModal}
        />
      )}
    </Layout>
  );
};

export default PageCounterparts;
