import React, { useState } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material';

import type { FormValues } from '../ApprovalPolicyForm';

interface AutocompleteTagsProps {
  control: Control<FormValues>;
  name: 'triggers.tags';
  label: string;
}

export const AutocompleteTags = ({
  control,
  name,
  label,
}: AutocompleteTagsProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const { root } = useRootElements();
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const {
    data: tags,
    isLoading: isTagsLoading,
    refetch,
  } = api.tags.getTags.useQuery({
    query: {
      name__in: [inputValue] || undefined,
    },
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          variant="outlined"
          fullWidth
          required
          error={Boolean(error)}
        >
          <Autocomplete
            {...field}
            id={field.name}
            multiple
            autoComplete
            includeInputInList
            filterSelectedOptions
            noOptionsText={t(i18n)`No tags found`}
            slotProps={{
              popper: { container: root },
            }}
            loading={isTagsLoading}
            options={tags?.data || []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(_) => _}
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
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isTagsLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                error={Boolean(error)}
                helperText={error?.message}
              />
            )}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
