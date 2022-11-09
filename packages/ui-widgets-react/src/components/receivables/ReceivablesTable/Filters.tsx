import React from 'react';
import styled from '@emotion/styled';
import { Search, Select } from '@team-monite/ui-kit-react';
import { ReceivablesReceivablesStatusEnum } from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { useCounterpartList } from 'core/queries';
import { counterpartsToSelect } from '../../payables/PayableDetails/PayableDetailsForm/helpers';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CUSTOMER,
} from './consts';
import { FilterTypes, FilterValue } from './types';

const Wrapper = styled.div`
  padding: 24px 12px 32px;
  display: flex;
  gap: 8px;
`;

type Props = {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
};

const Filters = ({ onChangeFilter }: Props) => {
  const { t } = useComponentsContext();
  const counterpartQuery = useCounterpartList();

  return (
    <Wrapper>
      <div style={{ width: 300 }}>
        <Search
          placeholder={t('common:search')}
          isFilter
          onSearch={(search) =>
            onChangeFilter(FILTER_TYPE_SEARCH, search || null)
          }
        />
      </div>
      <div style={{ width: 235 }}>
        <Select
          placeholder={t('common:status')}
          options={[
            { label: t('receivables:statuses.all'), value: 'all' },
            ...Object.values(ReceivablesReceivablesStatusEnum).map(
              (status) => ({
                label: t(`receivables:statuses.${status}`),
                value: status,
              })
            ),
          ]}
          isFilter
          isClearable
          onChange={(selected) =>
            onChangeFilter(FILTER_TYPE_STATUS, selected && selected.value)
          }
        />
      </div>
      <div style={{ width: 300 }}>
        <Select
          placeholder={t('common:customer')}
          isFilter
          isClearable
          options={counterpartsToSelect(counterpartQuery?.data?.data)}
          onChange={(selected) =>
            onChangeFilter(FILTER_TYPE_CUSTOMER, selected && selected.label)
          }
        />
      </div>
    </Wrapper>
  );
};

export default Filters;
