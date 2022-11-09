import React, { useState, useEffect } from 'react';
import { PayableStateEnum } from '@team-monite/sdk-api';
import { Box, DatePicker, Search, Select } from '@team-monite/ui-kit-react';
import styled from '@emotion/styled';

import { useComponentsContext } from '../../../../core/context/ComponentsContext';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';

const Wrapper = styled.div`
  padding: 12px 12px 32px;
  display: flex;
  gap: 8px;
`;

interface Props {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
}

const Filters = ({ onChangeFilter }: Props) => {
  const { t } = useComponentsContext();
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  useEffect(() => {
    onChangeFilter(FILTER_TYPE_DUE_DATE, dueDate);
  }, [dueDate]);

  useEffect(() => {
    onChangeFilter(FILTER_TYPE_CREATED_AT, createdAt);
  }, [createdAt]);

  return (
    <Wrapper>
      <Box width={300}>
        <Search
          placeholder={t('common:search')}
          isFilter
          onSearch={(search) =>
            onChangeFilter(FILTER_TYPE_SEARCH, search || null)
          }
        />
      </Box>
      <Box width={235}>
        <Select
          placeholder={t('common:status')}
          options={[
            { label: t('payables:statuses.all'), value: 'all' },
            ...Object.values(PayableStateEnum).map((status) => ({
              label: t(`payables:statuses.${status}`),
              value: status,
            })),
          ]}
          isFilter
          isClearable
          onChange={(selected) =>
            onChangeFilter(FILTER_TYPE_STATUS, selected && selected.value)
          }
        />
      </Box>
      <Box width={160}>
        <DatePicker
          date={createdAt}
          onChange={setCreatedAt}
          placeholder={t('payables:columns.invoiceDate')}
          isFilter
          isClearable
        />
      </Box>
      <Box width={160}>
        <DatePicker
          date={dueDate}
          onChange={setDueDate}
          placeholder={t('payables:columns.dueDate')}
          isFilter
          isClearable
        />
      </Box>
    </Wrapper>
  );
};

export default Filters;
