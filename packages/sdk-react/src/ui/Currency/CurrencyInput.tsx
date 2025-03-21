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
  displayCode?: boolean;
  error?: FieldError;
  required?: boolean;
  label?: string;
  defaultValue?: components['schemas']['CurrencyEnum'] | null;
}

export const CurrencyInput = ({
  displayCode,
  error,
  required,
  label,
  defaultValue = null,
  ...params
}: CurrencyInputProps) => {
  const { i18n } = useLingui();
  const { getSymbolFromCurrency } = useCurrencies();
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = params.inputProps.value
    ? getCurrenciesArray(i18n).find(
        (currency) =>
          (displayCode ? currency.code : currency.label) ===
          params.inputProps.value
      )
    : null;
  const currencyLabel = selectedOption
    ? displayCode
      ? selectedOption.code
      : selectedOption.label
    : '';
  const symbol = selectedOption
    ? getSymbolFromCurrency(selectedOption.code)
    : '';
  const fullText = selectedOption ? `${currencyLabel}, ${symbol}` : '';

  const isTextTruncated = useIsTextTruncated(inputRef.current, currencyLabel);

  const textField = (
    <TextField
      {...params}
      inputRef={inputRef}
      required={required}
      label={label}
      error={!!error?.message}
      helperText={error?.message}
      defaultValue={defaultValue}
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
            {selectedOption && (
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
      inputProps={{
        ...params.inputProps,
      }}
    />
  );

  return isTextTruncated ? (
    <Tooltip placement="top" title={fullText}>
      {textField}
    </Tooltip>
  ) : (
    textField
  );
};
