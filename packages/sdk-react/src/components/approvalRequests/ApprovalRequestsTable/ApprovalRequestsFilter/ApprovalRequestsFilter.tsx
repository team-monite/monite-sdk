import { components } from '@/api';
import { FilterContainer } from '@/components/misc/FilterContainer';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  SxProps,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { Theme } from 'mui-styles';

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
  sx?: SxProps<Theme>;
}

export const ApprovalRequestsFilter = ({ onChangeFilter, sx }: FilterProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-ApprovalRequestsFilters';

  return (
    <FilterContainer className={className} sx={sx}>
      <FormControl
        variant="outlined"
        fullWidth
        className="Monite-ApprovalStatusFilter Monite-FilterControl"
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
      <AutocompleteCreatedBy
        onChange={(id) => onChangeFilter(FILTER_TYPE_ADDED_BY, id || null)}
      />
      <DatePicker
        label={t(i18n)`Requested on`}
        className="Monite-ApprovalRequestedOnFilter Monite-FilterControl Monite-DateFilterControl"
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
      <FormControlLabel
        control={<Switch />}
        className="Monite-ApprovalOnlyMyFilter Monite-FilterControl"
        label={t(i18n)`Only my approvals`}
        onChange={(_, checked) =>
          onChangeFilter(FILTER_TYPE_CURRENT_USER, checked)
        }
      />
    </FilterContainer>
  );
};
