import { AutocompleteCreatedBy } from '@/components/approvalRequests/ApprovalRequestsTable/AutocompleteCreatedBy/AutocompleteCreatedBy';
import { FILTER_TYPE_ADDED_BY } from '@/components/approvalRequests/consts';
import { FilterContainer } from '@/components/misc/FilterContainer';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { Theme } from 'mui-styles';

import {
  FILTER_TYPE_CREATED_AT,
  FILTER_TYPE_CREATED_BY,
  FILTER_TYPE_SEARCH,
} from '../../consts';
import { FilterTypes, FilterValue } from '../../types';

type Props = {
  onChangeFilter: (field: keyof FilterTypes, value: FilterValue) => void;
  sx?: SxProps<Theme>;
};

export const Filters = ({ onChangeFilter, sx }: Props) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const className = 'Monite-ApprovalPoliciesFilters';

  return (
    <FilterContainer
      className={className}
      sx={sx}
      searchField={
        <SearchField
          label={t(i18n)`Search`}
          onChange={(search) => {
            onChangeFilter(FILTER_TYPE_SEARCH, search);
          }}
        />
      }
    >
      <AutocompleteCreatedBy
        onChange={(id) => onChangeFilter(FILTER_TYPE_ADDED_BY, id || null)}
      />
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
    </FilterContainer>
  );
};
