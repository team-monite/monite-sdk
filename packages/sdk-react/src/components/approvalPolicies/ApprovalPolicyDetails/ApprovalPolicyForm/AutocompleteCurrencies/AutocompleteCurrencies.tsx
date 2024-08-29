import { Control, Controller, useFormContext } from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { getCurrenciesArray } from '@/core/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Autocomplete,
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
            noOptionsText={t(i18n)`No currencies found`}
            slotProps={{
              popper: { container: root },
            }}
            options={getCurrenciesArray(i18n)}
            getOptionKey={(option) => option.code}
            getOptionLabel={(option) => option.label}
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
