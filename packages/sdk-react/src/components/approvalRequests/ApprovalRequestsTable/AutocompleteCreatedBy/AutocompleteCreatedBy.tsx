import { useState } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { classNames } from '@/utils/css-utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

interface AutocompleteCreatedByProps {
  onChange: (id?: string) => void;
  className?: string;
}

type EntityUserType = components['schemas']['EntityUserResponse'];

export const AutocompleteCreatedBy = ({
  onChange: onChangeFilter,
  className,
}: AutocompleteCreatedByProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<EntityUserType | null>(null);
  const [inputValue, setInputValue] = useState('');

  const {
    data: users,
    isLoading: isUsersLoading,
    refetch,
  } = api.entityUsers.getEntityUsers.useQuery(
    {
      query: { first_name: inputValue || undefined },
    },
    { enabled: open }
  );

  return (
    <Autocomplete
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText={t(i18n)`No users found`}
      slotProps={{
        popper: {
          container: root,
        },
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loading={isUsersLoading}
      options={users?.data || []}
      getOptionLabel={(option) =>
        `${option.first_name ?? ''} ${option.last_name ?? ''}`.trim()
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      filterOptions={(_) => _}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_, newValue: EntityUserType | null) => {
        setValue(newValue);
        onChangeFilter(newValue?.id);
        refetch();
      }}
      className={classNames(
        'Monite-ApprovalAddedByFilter-Container',
        'Monite-FilterControl',
        className
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t(i18n)`Added by`}
          className="Monite-ApprovalAddedByFilter Monite-FilterControl"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isUsersLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
