import { UseControllerProps, FieldValues, FieldPath } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';

import {
  RHFAutocompleteProps,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { RHFSelect } from '@/components/RHF/RHFSelect';
import { CurrencyType, getCurrenciesArray } from '@/core/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  MenuItem,
  Select,
  TextFieldProps,
  Typography,
} from '@mui/material';
import type { AutocompleteRenderInputParams } from '@mui/material';

import { CurrencyInput } from './CurrencyInput';
import { CurrencyOption } from './CurrencyOption';

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
  multiple?: RHFAutocompleteProps<
    TFieldValues,
    TName,
    CurrencyType
  >['multiple'];
  displayCode?: boolean;
  hideLabel?: boolean;
}

/**
 * Monite component for currency
 * Renders a currency with its symbol and value
 *  based on the Material UI Autocomplete component
 */
export const MoniteCurrency = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  displayCode,
  hideLabel = false,
  required,
  ...props
}: MoniteCurrencyProps<TFieldValues, TName>) => {
  const { i18n } = useLingui();
  const currencyLabel = t(i18n)`Currency`;

  const renderInput = (
    params: AutocompleteRenderInputParams,
    renderParams?: { error?: FieldError; label: string; required?: boolean }
  ) => (
    <CurrencyInput
      displayCode={displayCode}
      error={renderParams?.error}
      required={renderParams?.required ?? required}
      label={renderParams?.label ?? currencyLabel}
      {...params}
    />
  );

  return (
    <RHFAutocomplete
      {...props}
      required={required}
      className={`Monite-Currency ${hideLabel && 'Monite-Label-Hidden'}`}
      label={currencyLabel}
      options={getCurrenciesArray(i18n)}
      optionKey="code"
      labelKey={displayCode ? 'code' : 'label'}
      renderInput={renderInput}
      renderOption={(props, option) => (
        <CurrencyOption
          key={option.code}
          props={props}
          option={option}
          displayCode={displayCode}
        />
      )}
    />
  );
};
