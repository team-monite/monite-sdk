import React from 'react';

import { components } from '@/api';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  APPROVAL_REQUEST_STATUSES,
  FILTER_TYPE_ADDED_BY,
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CURRENT_USER,
  FILTER_TYPE_STATUS,
} from '../../consts';
import { getRowToStatusTextMap } from '../../helpers';
import { FilterTypes, FilterValue } from '../../types';
import { AutocompleteCreatedBy } from '../AutocompleteCreatedBy/AutocompleteCreatedBy';

interface FilterProps {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
}

export const ApprovalRequestsFilter = ({ onChangeFilter }: FilterProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Grid container justifyContent="space-between">
      <Grid item container spacing={2} xs={9}>
        <Grid item xs={6} sm={3}>
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
                    (selected.target.value as
                      | components['schemas']['ApprovalRequestStatus']
                      | 'all')
                );
              }}
            >
              {[
                { label: t(i18n)`All invoices`, value: 'all' },
                ...Object.values(APPROVAL_REQUEST_STATUSES).map((status) => ({
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
        <Grid item xs={6} sm={3}>
          <AutocompleteCreatedBy
            onChange={(id) => onChangeFilter(FILTER_TYPE_ADDED_BY, id || null)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
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
      <Grid item xs={6} sm={3} textAlign="right" alignContent="center">
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
