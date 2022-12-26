import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownMenuItem,
  Button,
  UAngleDown,
} from '@team-monite/ui-kit-react';
import {
  CounterpartDetails,
  CounterpartsTable,
} from '@team-monite/ui-widgets-react';
import { CounterpartType } from '@team-monite/sdk-api';
import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const PageCounterparts = () => {
  const { t } = useTranslation();

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
          <Dropdown
            button={
              <Button rightIcon={<UAngleDown />}>
                {t('common:createNew')}
              </Button>
            }
          >
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
