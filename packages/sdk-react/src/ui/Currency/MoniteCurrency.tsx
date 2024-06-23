'use client';

import React from 'react';
import { UseControllerProps, FieldValues } from 'react-hook-form';

import {
  IRHFAutocomplete,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { useCurrencies } from '@/core/hooks';
import { getCurrenciesArray } from '@/core/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MenuItem, TextFieldProps } from '@mui/material';

export interface IMoniteCurrencyProps<T extends FieldValues>
  extends UseControllerProps<T> {
  onChange?: IRHFAutocomplete<T, unknown>['onChange'];
  size?: TextFieldProps['size'];
  required?: TextFieldProps['required'];
}

/**
 * Monite component for currency
 * Renders a currency with its symbol and value
 *  based on the Material UI Autocomplete component
 */
export const MoniteCurrency = <F extends FieldValues>(
  props: IMoniteCurrencyProps<F>
) => {
  const { i18n } = useLingui();
  const { getSymbolFromCurrency } = useCurrencies();

  return (
    <RHFAutocomplete
      {...props}
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
