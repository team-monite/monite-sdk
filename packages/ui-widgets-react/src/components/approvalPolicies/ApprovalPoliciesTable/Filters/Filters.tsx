import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, DatePicker, Search, Select } from '@team-monite/ui-kit-react';
import { EntityUserResponse } from '@team-monite/sdk-api';
import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CREATED_BY,
} from '../../consts';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useEntityUsersList } from 'core/queries';
import { FilterTypes, FilterValue } from '../../types';

const Wrapper = styled.div`
  padding: 24px 12px 32px;
  display: flex;
  gap: 8px;
`;

type Props = {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
};

type Option = {
  value: string;
  label: string;
  icon?: string;
};

const Filters = ({ onChangeFilter }: Props) => {
  const { t } = useComponentsContext();
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [createdBy, setCreatedBy] = useState<string | null>(null);
  const { data: users } = useEntityUsersList();

  console.log(createdBy);

  useEffect(() => {
    onChangeFilter(FILTER_TYPE_CREATED_AT, createdAt);
  }, [createdAt]);

  useEffect(() => {
    onChangeFilter(FILTER_TYPE_CREATED_BY, createdBy);
  }, [createdBy]);

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
      <Box width={160}>
        <DatePicker
          date={createdAt}
          onChange={setCreatedAt}
          placeholder={t('common:createdAt')}
          isFilter
          isClearable
        />
      </Box>
      <Box width={300}>
        <Select
          // isMulti
          isClearable
          isFilter
          placeholder={t('common:createdBy')}
          options={
            users?.data.map((user: EntityUserResponse) => ({
              label: `${user.first_name} ${user.last_name}`,
              value: user.id,
              icon: user.userpic?.url,
            })) || []
          }
          onChange={(selected: Option) => setCreatedBy(selected?.value || null)}
        />
      </Box>
    </Wrapper>
  );
};

export default Filters;
