import { useLedgerAccounts } from '@/components/payables/hooks/useLedgerAccounts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useRootElements } from '@/core/context/RootElementsProvider';

export interface GLCodeOption {
  id: string;
  name: string;
  description?: string;
  type?: string;
}

export interface GLCodeSelectorProps {
  value?: string;
  onChange: (value: string | null) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const GLCodeSelector = ({
  value,
  onChange,
  error,
  helperText,
  disabled,
  placeholder,
}: GLCodeSelectorProps) => {
  const { i18n } = useLingui();
  const { data: ledgerAccounts, isLoading, error: fetchError } = useLedgerAccounts();
  const { root } = useRootElements();

  const options = useMemo<GLCodeOption[]>(() => {
    if (!ledgerAccounts?.data) return [];
    
    return ledgerAccounts.data.map((account) => ({
      id: account.id,
      name: account.name,
      description: account.description,
      type: account.type,
    }));
  }, [ledgerAccounts?.data]);

  const selectedOption = useMemo(() => {
    return value ? options.find((option) => option.id === value) || null : null;
  }, [value, options]);

  if (fetchError) {
    return (
      <FormControl error fullWidth>
        <TextField
          label={t(i18n)`GL Code`}
          variant="standard"
          disabled
          error
          helperText={t(i18n)`Failed to load GL codes`}
        />
      </FormControl>
    );
  }

  return (
    <Autocomplete<GLCodeOption>
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => onChange(newValue?.id || null)}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      disabled={disabled || isLoading}
      slotProps={{
        popper: {
          container: root,
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t(i18n)`GL Code`}
          variant="standard"
          fullWidth
          error={error}
          helperText={helperText}
          placeholder={placeholder || t(i18n)`Select GL code`}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <Typography variant="body2" component="div">
              {option.name}
            </Typography>
            {option.description && (
              <Typography variant="caption" color="text.secondary" component="div">
                {option.description}
              </Typography>
            )}
            {option.type && (
              <Typography variant="caption" color="primary" component="div">
                {option.type}
              </Typography>
            )}
          </div>
        </li>
      )}
      noOptionsText={t(i18n)`No GL codes found`}
    />
  );
};