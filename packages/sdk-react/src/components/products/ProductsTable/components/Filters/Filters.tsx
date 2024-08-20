import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_TYPE,
  FILTER_TYPE_UNITS,
} from '../../consts';
import { Filters as FilterType, FilterValue } from '../../types';

interface Props {
  onChangeFilter: (field: keyof FilterType, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();
  const { data: measureUnits, isLoading: isMeasureUnitsLoading } =
    api.measureUnits.getMeasureUnits.useQuery();
  const className = 'Monite-ProductFilters';

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={classNames(className, 'Monite-Filters')}
    >
      <SearchField
        label={t(i18n)`Search`}
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
          className="Monite-ProductTypeFilter Monite-FilterControl"
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
                label: t(i18n)`Products`,
                value: 'product',
                icons: <PersonIcon color="primary" fontSize="small" />,
              },
              {
                label: t(i18n)`Services`,
                value: 'service',
                icons: <BusinessIcon color="success" fontSize="small" />,
              },
            ].map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {/* We should use `ListItemIcon` component to be able to show `icons` */}
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          fullWidth
          disabled={isMeasureUnitsLoading}
          className="Monite-ProductUnitFilter Monite-FilterControl"
        >
          <InputLabel id="units">{t(i18n)`Units`}</InputLabel>
          <Select
            labelId="units"
            label={t(i18n)`Units`}
            defaultValue="all"
            MenuProps={{ container: root }}
            onChange={(search) => {
              onChangeFilter(FILTER_TYPE_UNITS, search.target.value);
            }}
          >
            {[
              { id: 'all', name: t(i18n)`All` },
              ...(measureUnits?.data ?? []),
            ].map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
};
