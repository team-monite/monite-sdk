import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
} from '@/components/userRoles/consts';
import { FilterType, FilterValue } from '@/components/userRoles/types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface FiltersProps {
  onChangeFilter: (field: keyof FilterType, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter }: FiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-UserRolesFilters';

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
      </Stack>
    </Stack>
  );
};
