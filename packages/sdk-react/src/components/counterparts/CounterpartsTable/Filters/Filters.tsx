import { CounterpartShowCategories } from '@/components/counterparts/Counterpart.types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Stack,
} from '@mui/material';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_IS_CUSTOMER,
} from '../consts';
import { Filters as FiltersType, FilterValue } from '../types';

interface Props extends CounterpartShowCategories {
  onChangeFilter: (field: keyof FiltersType, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter, showCategories }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-CounterpartFilters';

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classNames(className, 'Monite-Filters')}
    >
      <SearchField
        label={t(i18n)`Search by name`}
        onChange={(search) => {
          onChangeFilter(FILTER_TYPE_SEARCH, search);
        }}
      />
      <Stack
        gap={1}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        className="Monite-Filters-Group"
      >
        <FormControl
          variant="outlined"
          fullWidth
          className="Monite-CounterpartTypeFilter Monite-FilterControl"
        >
          <InputLabel id="type">{t(i18n)`Type`}</InputLabel>
          <Select
            labelId="type"
            label={t(i18n)`Type`}
            defaultValue="all"
            MenuProps={{ container: root }}
            onChange={(search) => {
              onChangeFilter(FILTER_TYPE_TYPE, search.target.value);
            }}
          >
            {[
              { label: t(i18n)`All`, value: 'all' },
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
            variant="outlined"
            fullWidth
            className="Monite-CounterpartCategoryFilter Monite-FilterControl"
          >
            <InputLabel id="category">{t(i18n)`Category`}</InputLabel>
            <Select
              labelId="category"
              label={t(i18n)`Category`}
              defaultValue="all"
              MenuProps={{ container: root }}
              onChange={(search) => {
                onChangeFilter(FILTER_TYPE_IS_CUSTOMER, search.target.value);
              }}
            >
              {[
                {
                  label: t(i18n)`Customers & Vendors`,
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
      </Stack>
    </Stack>
  );
};
