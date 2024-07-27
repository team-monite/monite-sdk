import React from 'react';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_CREATED_AT,
} from '@/components/userRoles/consts';
import { FilterType, FilterValue } from '@/components/userRoles/types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface FiltersProps {
  onChangeFilter: (field: keyof FilterType, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter }: FiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={3}>
        <SearchField
          label={t(i18n)`Search`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <DatePicker
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
      </Grid>
    </Grid>
  );
};
