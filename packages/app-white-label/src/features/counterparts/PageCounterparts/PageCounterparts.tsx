import React, { useCallback, useState } from 'react';
import {
  Button,
  CounterpartDetails,
  CounterpartsTable,
  CounterpartType,
} from '@team-monite/ui-widgets-react';

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

  return (
    <Layout>
      <PageHeader
        title="Counterparts"
        extra={
          <Dropdown button={<Button>Create New</Button>}>
            <DropdownMenuItem
              onClick={() => setType(CounterpartType.ORGANIZATION)}
            >
              Organization
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setType(CounterpartType.INDIVIDUAL)}
            >
              Individual
            </DropdownMenuItem>
          </Dropdown>
        }
      />

      <CounterpartsTable onRowClick={setId} onEdit={setId} />

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
