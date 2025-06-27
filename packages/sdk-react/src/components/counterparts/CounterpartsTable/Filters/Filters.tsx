import { CounterpartShowCategories } from '@/components/counterparts/types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { FilterContainer } from '@/ui/Filters/FilterContainer';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { Box, FormControl, MenuItem, Select, SxProps } from '@mui/material';

import { Theme } from 'mui-styles';

import {
  FILTER_TYPE_IS_CUSTOMER,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from '../consts';
import { Filters as FiltersType, FilterValue } from '../types';

interface Props extends CounterpartShowCategories {
  onChangeFilter: (field: keyof FiltersType, value: FilterValue) => void;
  sx?: SxProps<Theme>;
}

export const Filters = ({ onChangeFilter, showCategories, sx }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-CounterpartFilters';

  return (
    <FilterContainer
      className={className}
      sx={sx}
      searchField={
        <SearchField
          placeholder={t(i18n)`Search by name`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      }
    >
      <FormControl
        variant="standard"
        fullWidth
        className="Monite-CounterpartTypeFilter Monite-FilterControl"
      >
        <Select
          defaultValue="all"
          MenuProps={{ container: root }}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_TYPE, search.target.value);
          }}
        >
          {[
            { label: t(i18n)`All types`, value: 'all' },
            {
              label: t(i18n)`Individuals`,
              value: 'individual',
              icons: <PersonIcon color="primary" fontSize="small" />,
            },
            {
              label: t(i18n)`Companies`,
              value: 'organization',
              icons: <BusinessIcon color="success" fontSize="small" />,
            },
          ].map(({ label, value }) => (
            <MenuItem value={value} key={value}>
              {/* We should use `ListItemIcon` component to be able to show `icons` */}
              <Box sx={{ marginLeft: 1 }}>{label}</Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showCategories && (
        <FormControl
          variant="standard"
          fullWidth
          className="Monite-CounterpartCategoryFilter Monite-FilterControl"
        >
          <Select
            defaultValue="all"
            MenuProps={{ container: root }}
            onChange={(search) => {
              onChangeFilter(FILTER_TYPE_IS_CUSTOMER, search.target.value);
            }}
          >
            {[
              {
                label: t(i18n)`All categories`,
                value: 'all',
              },
              {
                label: t(i18n)`Customers`,
                value: 'true',
              },
              {
                label: t(i18n)`Vendors`,
                value: 'false',
              },
            ].map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </FilterContainer>
  );
};
