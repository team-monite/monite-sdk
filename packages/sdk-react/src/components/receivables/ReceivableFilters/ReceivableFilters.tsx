import { counterpartsToSelect } from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { getCommonStatusLabel } from '@/components/receivables/getCommonStatusLabel';
import { ReceivableFilterType } from '@/components/receivables/ReceivablesTable/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { type ReadableReceivablesStatus } from '@/enums/ReadableReceivablesStatusEnum';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Grid,
  FormControl as MuiFormControl,
  InputLabel as MuiInputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { formatISO } from 'date-fns';

export type ReceivableFilter<T extends keyof ReceivableFilterType> =
  | {
      field: T;
      value: ReceivableFilterType[T];
      options?: never;
    }
  | {
      field: 'status';
      value: ReceivableFilterType[T];
      options: Array<ReadableReceivablesStatus>;
    };

type ReceivableFiltersProps<T extends keyof ReceivableFilterType> = {
  onChange: (field: T, value: ReceivableFilterType[T]) => void;
  filters: ReceivableFilter<T>[];
};

export const ReceivableFilters = <T extends keyof ReceivableFilterType>({
  onChange,
  filters,
}: ReceivableFiltersProps<T>) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const { data: counterparts } = api.counterparts.getCounterparts.useQuery();
  const className = 'Monite-ReceivableFilters';

  const statusFilterOptions = filters.find(
    (filter) => filter.field === 'status'
  )?.options;

  return (
    <Grid
      container
      spacing={2}
      className={classNames(className, 'Monite-Filters')}
    >
      {filters.some((filter) => filter.field === 'document_id__contains') && (
        <Grid item sm={6} md={4}>
          <SearchField
            label={t(i18n)`Search`}
            value={
              filters.find((filter) => filter.field === 'document_id__contains')
                ?.value ?? ''
            }
            onChange={(search) => {
              onChange(
                'document_id__contains' as T,
                (search ?? undefined) as ReceivableFilterType[T]
              );
            }}
          />
        </Grid>
      )}

      {statusFilterOptions &&
        statusFilterOptions.length > 1 &&
        filters.some((filter) => filter.field === 'status') && (
          <Grid item sm={3} md={2}>
            <MuiFormControl
              variant="outlined"
              fullWidth
              className="Monite-ReceivableStatusFilter Monite-FilterControl"
            >
              <MuiInputLabel id="status">{t(i18n)`Status`}</MuiInputLabel>
              <Select
                labelId="status"
                label={t(i18n)`Status`}
                value={
                  filters.find((filter) => filter.field === 'status')?.value ??
                  ''
                }
                MenuProps={{ container: root }}
                onChange={(event) => {
                  onChange(
                    'status' as T,
                    (event.target.value || undefined) as ReceivableFilterType[T]
                  );
                }}
              >
                <MenuItem value={undefined}>{t(i18n)`All statuses`}</MenuItem>

                {statusFilterOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {getCommonStatusLabel(i18n, status)}
                  </MenuItem>
                ))}
              </Select>
            </MuiFormControl>
          </Grid>
        )}

      {filters.some((filter) => filter.field === 'counterpart_id') && (
        <Grid item sm={3} md={2}>
          <MuiFormControl
            variant="outlined"
            fullWidth
            className="Monite-ReceivableCounterpartFilter Monite-FilterControl"
          >
            <MuiInputLabel id="counterpart_id">{t(
              i18n
            )`Customer`}</MuiInputLabel>
            <Select
              labelId="counterpart_id"
              label={t(i18n)`Customer`}
              value={
                filters.find((filter) => filter.field === 'counterpart_id')
                  ?.value ?? ''
              }
              MenuProps={{ container: root }}
              onChange={(event) => {
                onChange(
                  'counterpart_id' as T,
                  (event.target.value || undefined) as ReceivableFilterType[T]
                );
              }}
            >
              <MenuItem value={undefined}>{t(i18n)`All customers`}</MenuItem>

              {counterpartsToSelect(counterparts?.data ?? []).map(
                ({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                )
              )}
            </Select>
          </MuiFormControl>
        </Grid>
      )}

      {filters.some((filter) => filter.field === 'due_date__lte') && (
        <Grid item xs={6} sm={3} md={2} lg={2}>
          <DatePicker
            className="Monite-ReceivableDueDateFilter Monite-FilterControl Monite-DateFilterControl"
            label={t(i18n)`Due date`}
            views={['year', 'month', 'day']}
            value={
              filters.find((filter) => filter.field === 'due_date__lte')?.value
            }
            onChange={(value, error) => {
              if (error.validationError) return;
              if (value === null || value === undefined)
                return void onChange('due_date__lte' as T, undefined);

              onChange(
                'due_date__lte' as T,
                formatISO(new Date(value), {
                  representation: 'date',
                }) as ReceivableFilterType[T]
              );
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
          />
        </Grid>
      )}
    </Grid>
  );
};
