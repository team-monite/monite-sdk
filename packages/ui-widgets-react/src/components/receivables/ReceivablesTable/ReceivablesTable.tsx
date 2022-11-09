import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Tabs, Tab, TabList, TabPanel } from '@team-monite/ui-kit-react';
import { ReceivablesReceivableType } from '@team-monite/sdk-api';

import ReceivableTypeTab from './ReceivableTypeTab';
import Filters from './Filters';

import { FilterTypes, FilterValue } from './types';

import { useComponentsContext } from 'core/context/ComponentsContext';

const StyledWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  height: 100%;

  .monite-tabs,
  .monite-tabs__tab-panel--selected {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .monite-tabs__tab-list {
    padding: 0 60px 4px;
    width: calc(100% + 96px);
    position: relative;
    left: -48px;
    border-bottom: 1px solid ${({ theme }) => theme.neutral80};
  }
`;

const Table = () => {
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const { t } = useComponentsContext();

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === 'all' ? null : value,
    }));
  };

  return (
    <StyledWrapper>
      <Tabs>
        <TabList>
          <Tab>{t('receivables:quotes')}</Tab>
          <Tab>{t('receivables:invoices')}</Tab>
          <Tab>{t('receivables:creditNotes')}</Tab>
        </TabList>
        <Filters onChangeFilter={onChangeFilter} />
        <TabPanel>
          <ReceivableTypeTab
            type={ReceivablesReceivableType.QUOTE}
            currentFilters={currentFilters}
          />
        </TabPanel>
        <TabPanel>
          <ReceivableTypeTab
            type={ReceivablesReceivableType.INVOICE}
            currentFilters={currentFilters}
          />
        </TabPanel>
        <TabPanel>
          <ReceivableTypeTab
            type={ReceivablesReceivableType.CREDIT_NOTE}
            currentFilters={currentFilters}
          />
        </TabPanel>
      </Tabs>
    </StyledWrapper>
  );
};

export default Table;
