import { useState } from 'react';
import { Controller, Control, useFormContext } from 'react-hook-form';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Autocomplete,
  CircularProgress,
  TextField,
  FormHelperText,
} from '@mui/material';

import type { FormValues } from '../ApprovalPolicyForm';

interface AutocompleteRolesProps {
  control: Control<FormValues>;
  name: 'rules.roles_from_list';
  label: string;
}

export const AutocompleteRoles = ({
  control,
  name,
  label,
}: AutocompleteRolesProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const {
    data: roles,
    isLoading,
    refetch,
  } = api.roles.getRoles.useQuery({
    query: {
      name: inputValue || undefined,
    },
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <>
          <Autocomplete
            {...field}
            id={field.name}
            multiple
            autoComplete
            includeInputInList
            filterSelectedOptions
            noOptionsText={t(i18n)`No roles found`}
            slotProps={{
              popper: {
                container: root,
              },
            }}
            loading={isLoading}
            options={roles?.data || []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(options) => options}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(_, value) => {
              setValue(name, value);
              refetch();
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </>
      )}
    />
  );
};
