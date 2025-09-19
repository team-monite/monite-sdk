import { components } from '@/api';
import { useLedgerAccounts } from '@/components/payables/hooks/useLedgerAccounts';
import { useRootElements } from '@/core/context/RootElementsProvider';
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

export interface GLCodeSelectorProps {
  value?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (value: string | null) => void;
}

export const GLCodeSelector = ({
  value,
  error,
  helperText,
  disabled,
  placeholder,
  onChange,
}: GLCodeSelectorProps) => {
  const { i18n } = useLingui();
  const {
    data: ledgerAccounts,
    isLoading,
    error: fetchError,
  } = useLedgerAccounts();
  const { root } = useRootElements();

  const options = useMemo<LedgerAccount[]>(() => {
    return ledgerAccounts?.data ?? [];
  }, [ledgerAccounts?.data]);

  const selectedOption = useMemo<LedgerAccount | null>(() => {
    if (!value) return null;

    return options.find((option) => option.id === value) ?? null;
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
    <Autocomplete<LedgerAccount>
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => onChange(newValue?.id || null)}
      getOptionLabel={(option) =>
        option.nominal_code && option.type
          ? `${option.nominal_code} — ${option.type}`
          : option.nominal_code || option.type || option.name
      }
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
          placeholder={placeholder}
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
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              fontWeight={600}
            >
              {option.nominal_code && option.type
                ? `${option.nominal_code} — ${option.type}`
                : option.nominal_code || option.type}
            </Typography>
            {option.subtype && (
              <Typography variant="body2" component="div" fontWeight={400}>
                {option.subtype}
              </Typography>
            )}
          </div>
        </li>
      )}
      noOptionsText={t(i18n)`No GL codes found`}
    />
  );
};

type LedgerAccount = components['schemas']['LedgerAccountResponse'];
