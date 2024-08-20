import { useRootElements } from '@/core/context/RootElementsProvider';
import { PayableStateEnum } from '@/enums/PayableStateEnum';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { getRowToStatusTextMap } from '../../consts';
import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_DUE_DATE,
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';

interface Props {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-PayableFilters';

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
          className="Monite-PayableStatusFilter Monite-FilterControl"
        >
          <InputLabel id="status">{t(i18n)`Status`}</InputLabel>
          <Select
            labelId="status"
            label={t(i18n)`Status`}
            defaultValue="all"
            MenuProps={{ container: root }}
            onChange={(selected) => {
              onChangeFilter(
                FILTER_TYPE_STATUS,
                selected && selected.target.value
              );
            }}
          >
            {[
              { label: t(i18n)`All invoices`, value: 'all' },
              ...Object.values(PayableStateEnum).map((status) => ({
                label: getRowToStatusTextMap(i18n)[status],
                value: status,
              })),
            ].map(({ label, value }) => (
              <MenuItem value={value} key={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          className="Monite-PayableDateFilter Monite-FilterControl Monite-DateFilterControl"
          label={t(i18n)`Invoice date`}
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
        <DatePicker
          className="Monite-PayableDueDateFilter Monite-FilterControl Monite-DateFilterControl"
          label={t(i18n)`Due date`}
          onChange={(value, error) => {
            if (error.validationError) {
              return;
            }

            onChangeFilter(FILTER_TYPE_DUE_DATE, value as string);
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
