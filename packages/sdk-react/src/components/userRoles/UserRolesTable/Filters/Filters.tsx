import { FilterContainer } from '@/components/misc/FilterContainer';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_SEARCH,
} from '@/components/userRoles/consts';
import { FilterType, FilterValue } from '@/components/userRoles/types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { SxProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { Theme } from 'mui-styles';

interface FiltersProps {
  onChangeFilter: (field: keyof FilterType, value: FilterValue) => void;
  sx?: SxProps<Theme>;
}

export const Filters = ({ onChangeFilter, sx }: FiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-UserRolesFilters';

  return (
    <FilterContainer
      className={className}
      sx={sx}
      searchField={
        <SearchField
          label={t(i18n)`Search`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      }
    >
      <DatePicker
        className="Monite-UserRoleCreateAtFilter Monite-FilterControl Monite-DateFilterControl"
        label={t(i18n)`Created on`}
        onChange={(value, error) => {
          if (error.validationError) {
            return;
          }

          if (value instanceof Date) {
            onChangeFilter(FILTER_TYPE_CREATED_AT, value);
          }
        }}
        slotProps={{
          popper: {
            container: root,
          },
          dialog: {
            container: root,
          },
          actionBar: {
            actions: ['clear', 'today'],
          },
        }}
        views={['year', 'month', 'day']}
      />
    </FilterContainer>
  );
};
