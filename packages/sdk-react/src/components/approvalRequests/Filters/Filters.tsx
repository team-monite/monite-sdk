import React from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ApprovalRequestStatus } from '@monite/sdk-api';
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CURRENT_USER,
  FILTER_TYPE_STATUS,
  getRowToStatusTextMap,
} from '../consts';
import { FilterTypes, FilterValue } from '../types';

interface Props {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
}

export const Filters = ({ onChangeFilter }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Grid container justifyContent="space-between">
      <Grid item container spacing={2} xs={10}>
        <Grid item xs={6} sm={3} md={4} lg={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="status">{t(i18n)`Status`}</InputLabel>
            <Select
              labelId="status"
              label={t(i18n)`Status`}
              defaultValue="all"
              MenuProps={{ container: root }}
              onChange={(selected) => {
                onChangeFilter(
                  FILTER_TYPE_STATUS,
                  selected &&
                    (selected.target.value as ApprovalRequestStatus | 'all')
                );
              }}
            >
              {[
                { label: t(i18n)`All invoices`, value: 'all' },
                ...Object.values(ApprovalRequestStatus).map((status) => ({
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
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            label={t(i18n)`Requested on`}
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
              actionBar: {
                actions: ['clear', 'today'],
              },
            }}
            views={['year', 'month', 'day']}
          />
        </Grid>
      </Grid>
      <Grid item xs={2} textAlign="right" alignContent="center">
        <FormControlLabel
          control={<Switch />}
          label={t(i18n)`Only my approvals`}
          onChange={(_, checked) =>
            onChangeFilter(FILTER_TYPE_CURRENT_USER, checked)
          }
        />
      </Grid>
    </Grid>
  );
};
