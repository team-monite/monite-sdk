import { useState } from 'react';
import { Controller, Control, useFormContext } from 'react-hook-form';

import { getCounterpartName } from '@/components/counterparts/helpers';
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

interface AutocompleteCreatedByProps {
  control: Control<FormValues>;
  name: 'triggers.counterpart_id';
  label: string;
}

export const AutocompleteCounterparts = ({
  control,
  name,
  label,
}: AutocompleteCreatedByProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const {
    data: counterparts,
    isLoading: isCounterpartsLoading,
    refetch,
  } = api.counterparts.getCounterparts.useQuery({
    query: {
      ...(inputValue && { counterpart_name__icontains: inputValue }),
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
            noOptionsText={t(i18n)`No users found`}
            slotProps={{
              popper: {
                container: root,
              },
            }}
            loading={isCounterpartsLoading}
            options={counterparts?.data || []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => getCounterpartName(option)}
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
                      {isCounterpartsLoading ? (
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
