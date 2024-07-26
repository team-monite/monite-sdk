import React from 'react';
import { UseControllerProps, FieldValues, FieldPath } from 'react-hook-form';

import {
  RHFAutocompleteProps,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { useCurrencies } from '@/core/hooks';
import { CurrencyType, getCurrenciesArray } from '@/core/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MenuItem, TextFieldProps } from '@mui/material';

export interface MoniteCurrencyProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  onChange?: RHFAutocompleteProps<
    TFieldValues,
    TName,
    CurrencyType
  >['onChange'];
  size?: TextFieldProps['size'];
  required?: TextFieldProps['required'];
}

/**
 * Monite component for currency
 * Renders a currency with its symbol and value
 *  based on the Material UI Autocomplete component
 */
export const MoniteCurrency = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  props: MoniteCurrencyProps<TFieldValues, TName>
) => {
  const { i18n } = useLingui();
  const { getSymbolFromCurrency } = useCurrencies();

  return (
    <RHFAutocomplete
      {...props}
      className="Monite__Currency"
      label={t(i18n)`Currency`}
      options={getCurrenciesArray(i18n)}
      optionKey="code"
      labelKey="label"
      renderOption={(props, option) => (
        <MenuItem key={option.code} value={option.label} {...props}>
          {option.label}, {getSymbolFromCurrency(option.code)}
        </MenuItem>
      )}
    />
  );
};
