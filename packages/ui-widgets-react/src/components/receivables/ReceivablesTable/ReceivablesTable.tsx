import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  Tabs,
  Tab,
  TabList,
  TabPanel,
  SortOrderEnum,
} from '@team-monite/ui-kit-react';
import { ReceivableCursorFields, ReceivableType } from '@team-monite/sdk-api';

import Filters from './Filters';
import ReceivableTypeTab from './ReceivableTypeTab';

import { FilterTypes, FilterValue } from './types';

import { useComponentsContext } from 'core/context/ComponentsContext';

interface Props {
  onRowClick?: (id: string) => void;
  onChangeSort?: (
    params: {
      sort: ReceivableCursorFields;
      order: SortOrderEnum | null;
    } | null
  ) => void;
  onChangeFilter?: (filter: {
    field: keyof FilterTypes;
    value: FilterValue;
  }) => void;
}

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

const ReceivablesTable = ({
  onChangeSort: onChangeSortCallback,
  onChangeFilter: onChangeFilterCallback,
  onRowClick,
}: Props) => {
  const [currentFilters, setCurrentFilters] = useState<FilterTypes>({});

  const { t } = useComponentsContext();

  const onChangeFilter = (field: keyof FilterTypes, value: FilterValue) => {
    setCurrentFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === 'all' ? null : value,
    }));

    onChangeFilterCallback && onChangeFilterCallback({ field, value });
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
            type={ReceivableType.QUOTE}
            currentFilters={currentFilters}
            onChangeSort={onChangeSortCallback}
            onRowClick={onRowClick}
          />
        </TabPanel>
        <TabPanel>
          <ReceivableTypeTab
            type={ReceivableType.INVOICE}
            currentFilters={currentFilters}
            onChangeSort={onChangeSortCallback}
            onRowClick={onRowClick}
          />
        </TabPanel>
        <TabPanel>
          <ReceivableTypeTab
            type={ReceivableType.CREDIT_NOTE}
            currentFilters={currentFilters}
            onChangeSort={onChangeSortCallback}
            onRowClick={onRowClick}
          />
        </TabPanel>
      </Tabs>
    </StyledWrapper>
  );
};

export default ReceivablesTable;
