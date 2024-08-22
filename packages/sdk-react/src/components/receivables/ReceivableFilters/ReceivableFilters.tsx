import { FilterContainer } from '@/components/misc/FilterContainer';
import { counterpartsToSelect } from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { getCommonStatusLabel } from '@/components/receivables/getCommonStatusLabel';
import { ReceivableFilterType } from '@/components/receivables/ReceivablesTable/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  type ReadableReceivablesStatus,
  ReadableReceivableStatuses,
} from '@/enums/ReadableReceivablesStatusEnum';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl as MuiFormControl,
  InputLabel as MuiInputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { formatISO } from 'date-fns';

import { type ReceivablesFilterHandler } from './useReceivablesFilters';

type ReceivableFiltersProps = {
  onChange: ReceivablesFilterHandler;
  filters: Array<keyof ReceivableFilterType>;
};

export const ReceivableFilters = ({
  onChange,
  filters,
}: ReceivableFiltersProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const { data: counterparts } = api.counterparts.getCounterparts.useQuery();
  const className = 'Monite-ReceivableFilters';

  return (
    <FilterContainer
      className={className}
      searchField={
        <SearchField
          label={t(i18n)`Search`}
          onChange={(search) => {
            onChange('document_id__contains', search ?? undefined);
          }}
        />
      }
    >
      {filters.includes('status') && (
        <MuiFormControl
          variant="outlined"
          fullWidth
          className="Monite-ReceivableStatusFilter Monite-FilterControl"
        >
          <MuiInputLabel id="status">{t(i18n)`Status`}</MuiInputLabel>
          <Select<ReadableReceivablesStatus>
            labelId="status"
            label={t(i18n)`Status`}
            defaultValue={undefined}
            MenuProps={{ container: root }}
            onChange={(event) => {
              console.log(event.target.value);

              onChange(
                'status',
                event.target.value as ReadableReceivablesStatus
              );
            }}
          >
            <MenuItem value={undefined}>{t(i18n)`All statuses`}</MenuItem>

            {ReadableReceivableStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {getCommonStatusLabel(i18n, status)}
              </MenuItem>
            ))}
          </Select>
        </MuiFormControl>
      )}

      {filters.includes('counterpart_id') && (
        <MuiFormControl
          variant="outlined"
          fullWidth
          className="Monite-ReceivableCounterpartFilter Monite-FilterControl"
        >
          <MuiInputLabel id="counterpart_id">{t(i18n)`Customer`}</MuiInputLabel>
          <Select
            labelId="counterpart_id"
            label={t(i18n)`Customer`}
            defaultValue={undefined}
            MenuProps={{ container: root }}
            onChange={(event) => {
              onChange('counterpart_id', event.target.value);
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
      )}

      {filters.includes('due_date__lte') && (
        <DatePicker<Date>
          className="Monite-ReceivableDueDateFilter Monite-FilterControl Monite-DateFilterControl"
          label={t(i18n)`Due date`}
          views={['year', 'month', 'day']}
          onChange={(value, error) => {
            if (error.validationError || value === null) {
              return;
            }

            onChange(
              'due_date__lte',
              formatISO(value, {
                representation: 'date',
              })
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
      )}
    </FilterContainer>
  );
};
