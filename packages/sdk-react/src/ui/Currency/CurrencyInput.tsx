import { useRef } from 'react';
import type { FieldError } from 'react-hook-form';

import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { getCurrenciesArray } from '@/core/utils';
import { useLingui } from '@lingui/react';
import {
  AutocompleteRenderInputParams,
  TextField,
  Tooltip,
  Box,
} from '@mui/material';

import { useIsTextTruncated } from './useIsTextTruncated';

interface CurrencyInputProps extends AutocompleteRenderInputParams {
  error?: FieldError;
  required?: boolean;
  label?: string;
  defaultValue?: components['schemas']['CurrencyEnum'] | null;
  showCodeOnly?: boolean;
  showCurrencySymbol?: boolean;
  showCurrencyCode?: boolean;
}

export const CurrencyInput = ({
  error,
  required,
  label,
  showCodeOnly = false,
  showCurrencySymbol = true,
  showCurrencyCode = false,
  ...params
}: CurrencyInputProps) => {
  const { i18n } = useLingui();
  const { getSymbolFromCurrency } = useCurrencies();
  const inputRef = useRef<HTMLInputElement>(null);

  const baseInputValue = params.inputProps.value as string;

  const selectedOption = baseInputValue
    ? getCurrenciesArray(i18n).find(
        (currency) =>
          (showCodeOnly ? currency.code : currency.label) === baseInputValue
      )
    : null;

  let displayValueInInput = baseInputValue;

  if (selectedOption && showCodeOnly) {
    displayValueInInput = selectedOption.code;
  }

  if (selectedOption && !showCodeOnly) {
    displayValueInInput = selectedOption.label;
    if (showCurrencyCode) {
      displayValueInInput += ` (${selectedOption.code})`;
    }
  }

  const symbol = selectedOption
    ? getSymbolFromCurrency(selectedOption.code)
    : '';

  const tooltipText = selectedOption
    ? `${selectedOption.label} (${selectedOption.code})${
        symbol ? `, ${symbol}` : ''
      }`
    : '';
  const isTextTruncated = useIsTextTruncated(
    inputRef.current,
    displayValueInInput
  );

  return (
    <Tooltip title={isTextTruncated ? tooltipText : ''} placement="top">
      <TextField
        {...params}
        inputProps={{
          ...params.inputProps,
          value: displayValueInInput,
        }}
        inputRef={inputRef}
        required={required}
        label={label}
        error={!!error?.message}
        helperText={error?.message}
        InputProps={{
          ...params.InputProps,
          sx: {
            '& input': {
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            },
          },
          endAdornment: (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                height: '100%',
              }}
            >
              {!showCodeOnly && showCurrencySymbol && symbol && (
                <Box
                  sx={{
                    whiteSpace: 'nowrap',
                    mr: 1,
                  }}
                >
                  {symbol}
                </Box>
              )}
              {params.InputProps.endAdornment}
            </Box>
          ),
        }}
      />
    </Tooltip>
  );
};
