import React, { useState } from 'react';
import { Control, Controller, useFormContext } from 'react-hook-form';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { getCurrenciesArray } from '@/core/utils';
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

interface AutocompleteCurrenciesProps {
  control: Control<FormValues>;
  name: 'triggers.currency';
  label: string;
}

export const AutocompleteCurrencies = ({
  control,
  name,
  label,
}: AutocompleteCurrenciesProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { setValue } = useFormContext();
  const [inputValue, setInputValue] = useState('');

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
            noOptionsText={t(i18n)`No currencies found`}
            slotProps={{
              popper: { container: root },
            }}
            options={getCurrenciesArray(i18n)}
            getOptionKey={(option) => option.code}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            filterOptions={(_) => _}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(_, value) => {
              setValue(name, value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
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
