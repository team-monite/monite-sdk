import React from 'react';

import { counterpartsToSelect } from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { type ReceivablesFilterHandler } from '@/components/receivables/Filters/useReceivablesFilters';
import { FilterTypes } from '@/components/receivables/ReceivablesTable/types';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCounterpartList } from '@/core/queries';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReceivablesStatusEnum } from '@monite/sdk-api';
import {
  Grid,
  FormControl as MuiFormControl,
  InputLabel as MuiInputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import {
  FILTER_TYPE_SEARCH,
  FILTER_TYPE_STATUS,
  FILTER_TYPE_CUSTOMER,
  FILTER_TYPE_DUE_DATE_LTE,
} from '../consts';

type Props = {
  onChangeFilter: ReceivablesFilterHandler;
  filters: Array<keyof FilterTypes>;
};

export const Filters = ({ onChangeFilter, filters }: Props) => {
  const { i18n } = useLingui();
  const counterpartQuery = useCounterpartList();
  const { root } = useRootElements();

  return (
    <Grid container spacing={2}>
      {filters.includes('search') && (
        <Grid item sm={6} md={4}>
          <SearchField
            label={t(i18n)`Search`}
            onChange={(search) => {
              onChangeFilter(FILTER_TYPE_SEARCH, search);
            }}
          />
        </Grid>
      )}
      {filters.includes('status') && (
        <Grid item sm={3} md={2}>
          <MuiFormControl variant="outlined" fullWidth>
            <MuiInputLabel id="status">{t(i18n)`Status`}</MuiInputLabel>
            <Select
              labelId="status"
              label={t(i18n)`Status`}
              defaultValue="all"
              MenuProps={{ container: root }}
              onChange={(selected) => {
                onChangeFilter(
                  FILTER_TYPE_STATUS,
                  selected.target.value === 'all'
                    ? null
                    : (selected.target.value as ReceivablesStatusEnum)
                );
              }}
            >
              {[
                { label: t(i18n)`All statuses`, value: 'all' },
                ...Object.values(ReceivablesStatusEnum).map((status) => ({
                  label: (() => {
                    switch (status) {
                      case ReceivablesStatusEnum.DRAFT:
                        return t(i18n)`Draft`;
                      case ReceivablesStatusEnum.ISSUED:
                        return t(i18n)`Issued`;
                      case ReceivablesStatusEnum.ACCEPTED:
                        return t(i18n)`Accepted`;
                      case ReceivablesStatusEnum.EXPIRED:
                        return t(i18n)`Expired`;
                      case ReceivablesStatusEnum.DECLINED:
                        return t(i18n)`Declined`;
                      case ReceivablesStatusEnum.RECURRING:
                        return t(i18n)`Recurring`;
                      case ReceivablesStatusEnum.PARTIALLY_PAID:
                        return t(i18n)`Partially Paid`;
                      case ReceivablesStatusEnum.PAID:
                        return t(i18n)`Paid`;
                      case ReceivablesStatusEnum.OVERDUE:
                        return t(i18n)`Overdue`;
                      case ReceivablesStatusEnum.UNCOLLECTIBLE:
                        return t(i18n)`Uncollectible`;
                      case ReceivablesStatusEnum.CANCELED:
                        return t(i18n)`Canceled`;
                      case ReceivablesStatusEnum.DELETED:
                        return t(i18n)`Deleted`;
                      default:
                        throw new Error(
                          `Unknown status ${JSON.stringify(status)}}`
                        );
                    }
                  })(),
                  value: status,
                })),
              ].map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </MuiFormControl>
        </Grid>
      )}
      {filters.includes('customer') && (
        <Grid item sm={3} md={2}>
          <MuiFormControl variant="outlined" fullWidth>
            <MuiInputLabel id="customer">{t(i18n)`Customer`}</MuiInputLabel>
            <Select
              labelId="customer"
              label={t(i18n)`Customer`}
              defaultValue="all"
              MenuProps={{ container: root }}
              onChange={(selected) => {
                onChangeFilter(
                  FILTER_TYPE_CUSTOMER,
                  selected.target.value === 'all' ? null : selected.target.value
                );
              }}
            >
              {[
                { label: t(i18n)`All customers`, value: 'all' },
                ...counterpartsToSelect(counterpartQuery?.data?.data),
              ].map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </MuiFormControl>
        </Grid>
      )}
      {filters.includes('due_date__lte') && (
        <Grid item xs={6} sm={3} md={2} lg={2}>
          <DatePicker<Date>
            label={t(i18n)`Due date`}
            onChange={(value, error) => {
              if (error.validationError) {
                return;
              }

              onChangeFilter(FILTER_TYPE_DUE_DATE_LTE, value);
            }}
            slotProps={{
              popper: {
                container: root,
              },
              actionBar: {
                actions: ['clear', 'today'],
              },
            }}
            views={['year', 'month', 'day']}
          />
        </Grid>
      )}
    </Grid>
  );
};
