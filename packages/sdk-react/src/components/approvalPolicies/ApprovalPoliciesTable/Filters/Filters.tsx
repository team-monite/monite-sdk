import { useState } from 'react';

import { FilterContainer } from '@/components/misc/FilterContainer';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { SearchField } from '@/ui/SearchField';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  const { api } = useMoniteContext();
  const { root } = useRootElements();
  const theme = useTheme();
  const [selectedUserId, setSelectedUserId] = useState<string | null>('all');

  const { data: users, isLoading: isUsersLoading } =
    api.entityUsers.getEntityUsers.useQuery({
      query: { first_name: undefined },
    });

  return (
    <FilterContainer
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
      <Grid item xs={3}>
        <FormControl
          fullWidth
          size="small"
          className="Monite-SearchField Monite-FilterControl"
        >
          {!theme?.components?.MuiFormControl ? (
            <InputLabel id="created-by-label">{t(i18n)`Added by`}</InputLabel>
          ) : null}
          <Select
            labelId="created-by-label"
            label={t(i18n)`Added by`}
            value={selectedUserId}
            defaultValue="all"
            className={classNames(
              'Monite-ApprovalAddedByFilter-Container',
              'Monite-FilterControl'
            )}
            onChange={(event) => {
              const selectedId = event.target.value;
              setSelectedUserId(selectedId);
              onChangeFilter(FILTER_TYPE_CREATED_BY, selectedId || null);
            }}
            renderValue={(value) => {
              if (isUsersLoading) {
                return <CircularProgress color="inherit" size={20} />;
              }
              const selectedUser = users?.data.find(
                (user) => user.id === value
              );
              return selectedUser
                ? `${selectedUser.first_name} ${selectedUser.last_name}`
                : t(i18n)`All users`;
            }}
            MenuProps={{ container: root }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all" key="all">{t(i18n)`All users`}</MenuItem>
            {(users?.data || []).map((user) => (
              <MenuItem value={user.id} key={user.id}>
                {`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
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
