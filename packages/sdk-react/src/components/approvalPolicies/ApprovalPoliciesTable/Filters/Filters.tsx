import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { FILTER_TYPE_SEARCH, FILTER_TYPE_CREATED_AT } from '../../consts';
import { FilterTypes, FilterValue } from '../../types';

type Props = {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
};

export const Filters = (props: Props) => {
  const { i18n } = useLingui();
  const onChangeFilter = props.onChangeFilter;
  const { root } = useRootElements();
  const className = 'Monite-ApprovalPoliciesFilters';

  return (
    <Grid
      container
      spacing={2}
      className={classNames(className, 'Monite-Filters')}
    >
      <Grid item xs={8} sm={5} md={4}>
        <SearchField
          label={t(i18n)`Search`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      </Grid>
      <Grid item xs={4} sm={3} md={2}>
        <DatePicker
          className="Monite-ApprovalPolicyCreateAtFilter Monite-FilterControl Monite-DateFilterControl"
          label={t(i18n)`Created at`}
          onChange={(value, error) => {
            if (error.validationError) {
              return;
            }

            onChangeFilter(FILTER_TYPE_CREATED_AT, value as string);
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
