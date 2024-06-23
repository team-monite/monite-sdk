'use client';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
} from '../../../../products/ProductsTable/consts';
import {
  Filters as FilterType,
  FilterValue,
} from '../../../../products/ProductsTable/types';

export interface ProductsTableFiltersProps {
  onChangeFilter: (field: keyof FilterType, value: FilterValue) => void;
}

export const ProductsTableFilters = ({
  onChangeFilter,
}: ProductsTableFiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel htmlFor="search-by-name">{t(i18n)`Search`}</InputLabel>
          <OutlinedInput
            id="search-by-name"
            label={t(i18n)`Search`}
            onChange={(e) => {
              onChangeFilter(FILTER_TYPE_SEARCH, e.target.value || null);
            }}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon fontSize="medium" />
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel htmlFor="type">{t(i18n)`Type`}</InputLabel>
          <Select
            labelId="type"
            label={t(i18n)`Type`}
            defaultValue="all"
            MenuProps={{ container: root }}
            onChange={(e) => {
              onChangeFilter(FILTER_TYPE_TYPE, e.target.value);
            }}
          >
            {[
              { label: t(i18n)`All types`, value: 'all' },
              { label: t(i18n)`Product`, value: 'product' },
              { label: t(i18n)`Service`, value: 'service' },
            ].map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
