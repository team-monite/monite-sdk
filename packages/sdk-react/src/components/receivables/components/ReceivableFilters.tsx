import { FilterContainer } from '@/components/misc/FilterContainer';
import { counterpartsToSelect } from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { ReceivableFilterType } from '@/components/receivables/types';
import { getCommonStatusLabel } from '@/components/receivables/utils';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { type ReadableReceivablesStatus } from '@/enums/ReadableReceivablesStatusEnum';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CalendarToday } from '@mui/icons-material';
import { FormControl as MuiFormControl, MenuItem, Select } from '@mui/material';
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
    <FilterContainer
      className={className}
      searchField={
        <SearchField
          placeholder={t(i18n)`Search`}
          onChange={(search) => {
            onChange(
              'document_id__contains' as T,
              (search ?? undefined) as ReceivableFilterType[T]
            );
          }}
        />
      }
    >
      {statusFilterOptions &&
        statusFilterOptions.length > 1 &&
        filters.some((filter) => filter.field === 'status') && (
          <MuiFormControl
            fullWidth
            className="Monite-ReceivableStatusFilter Monite-FilterControl"
            variant="standard"
          >
            <Select<ReadableReceivablesStatus>
              labelId="status"
              label={t(i18n)`Status`}
              defaultValue={undefined}
              MenuProps={{ container: root }}
              displayEmpty
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
        )}

      {filters.some((filter) => filter.field === 'counterpart_id') && (
        <MuiFormControl
          variant="standard"
          fullWidth
          className="Monite-ReceivableCounterpartFilter Monite-FilterControl"
        >
          <Select
            labelId="counterpart_id"
            label={t(i18n)`Customer`}
            defaultValue={undefined}
            MenuProps={{ container: root }}
            displayEmpty
            onChange={(event) => {
              onChange(
                'counterpart_id' as T,
                (event.target.value || undefined) as ReceivableFilterType[T]
              );
            }}
          >
            <MenuItem value={undefined}>{t(i18n)`All customers`}</MenuItem>

            {counterpartsToSelect(counterparts?.data ?? [])
              .sort((a, b) => a.label.localeCompare(b.label))
              .map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
          </Select>
        </MuiFormControl>
      )}

      {filters.some((filter) => filter.field === 'due_date__lte') && (
        <DatePicker<Date>
          className="Monite-ReceivableDueDateFilter Monite-FilterControl Monite-DateFilterControl"
          views={['year', 'month', 'day']}
          slots={{
            openPickerIcon: CalendarToday,
          }}
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
            textField: {
              variant: 'standard',
              placeholder: 'Due date',
              InputProps: {
                sx: {
                  '&::placeholder': {
                    opacity: 1,
                    color: 'text.primary',
                  },
                  '& input::placeholder': {
                    opacity: 1,
                    color: 'text.primary',
                  },
                },
              },
            },
            popper: {
              container: root,
            },
            dialog: {
              container: root,
            },
            actionBar: {
              actions: ['clear', 'today'],
            },
            openPickerIcon: {
              fontSize: 'small',
            },
          }}
        />
      )}
    </FilterContainer>
  );
};
