import React from 'react';
import { CounterpartType } from '@team-monite/sdk-api';
import { Search, Select } from '@team-monite/ui-kit-react';
import styled from '@emotion/styled';

import { useComponentsContext } from 'core/context/ComponentsContext';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from './consts';
import { Filters as FiltersType, FilterValue } from './types';

const Wrapper = styled.div`
  padding: 12px 12px 32px;
  display: flex;
  gap: 8px;
`;

const Item = styled.div``;

interface Props {
  onChangeFilter: (field: keyof FiltersType, value: FilterValue) => void;
}

const Filters = ({ onChangeFilter }: Props) => {
  const { t } = useComponentsContext();

  return (
    <Wrapper>
      <Item style={{ width: 300 }}>
        <Search
          placeholder={t('counterparts:filters.search')}
          isFilter
          onSearch={(search) =>
            onChangeFilter(FILTER_TYPE_SEARCH, search || null)
          }
        />
      </Item>
      <Item style={{ width: 285 }}>
        <Select
          placeholder={t('counterparts:filters.isCustomer.all')}
          options={[
            { label: t('counterparts:filters.isCustomer.all'), value: 'all' },
            {
              label: t('counterparts:filters.isCustomer.customers'),
              value: 'true',
            },
            {
              label: t('counterparts:filters.isCustomer.vendors'),
              value: 'false',
            },
          ]}
          isFilter
          isClearable
          onChange={(selected) =>
            onChangeFilter(FILTER_TYPE_IS_CUSTOMER, selected && selected.value)
          }
        />
      </Item>
      <Item style={{ width: 235 }}>
        <Select
          placeholder={t('counterparts:filters.type.all')}
          options={[
            { label: t('counterparts:filters.type.all'), value: 'all' },
            {
              label: t('counterparts:filters.type.individuals'),
              value: CounterpartType.INDIVIDUAL,
            },
            {
              label: t('counterparts:filters.type.companies'),
              value: CounterpartType.ORGANIZATION,
            },
          ]}
          isFilter
          isClearable
          onChange={(selected) =>
            onChangeFilter(FILTER_TYPE_TYPE, selected && selected.value)
          }
        />
      </Item>
    </Wrapper>
  );
};

export default Filters;
