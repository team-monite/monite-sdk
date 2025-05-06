import { useMemo } from 'react';
import { Fragment } from 'react';
import { UseControllerProps, FieldValues, FieldPath } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';

import { components } from '@/api';
import {
  RHFAutocompleteProps,
  RHFAutocomplete,
} from '@/components/RHF/RHFAutocomplete';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  type CurrencyType,
  type CurrencyGroup,
  getCurrenciesArray,
  filterOptions,
  getGroupTitleForOption,
  sortCurrencyOptionsByGroup,
} from '@/core/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ListSubheader, Divider } from '@mui/material';
import { TextFieldProps } from '@mui/material';

import { CurrencyInput } from './CurrencyInput';
import { CurrencyOption } from './CurrencyOption';

export type { CurrencyType, CurrencyGroup };

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
  showCodeOnly?: boolean;
  hideLabel?: boolean;
  actualCurrency?: components['schemas']['CurrencyEnum'];
  fullWidth?: boolean;
  shouldDisplayCustomList?: boolean;
  groups?: CurrencyGroup[];
  showCurrencyCode?: boolean;
  showCurrencySymbol?: boolean;
  showClearButton?: boolean;
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
  required,
  actualCurrency,
  groups,
  fullWidth,
  showCodeOnly,
  hideLabel = false,
  shouldDisplayCustomList,
  showCurrencyCode = false,
  showCurrencySymbol = true,
  showClearButton = true,
  ...props
}: MoniteCurrencyProps<TFieldValues, TName>) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();
  const currencyLabel = t(i18n)`Currency`;

  const currencyOptions = useMemo(
    () =>
      shouldDisplayCustomList
        ? getCurrenciesArray(i18n).filter((currencyItem) =>
            componentSettings?.receivables?.bankAccountCurrencies?.includes(
              currencyItem?.code
            )
          )
        : getCurrenciesArray(i18n),
    [componentSettings, shouldDisplayCustomList, i18n]
  );

  const sortedOptions = sortCurrencyOptionsByGroup(currencyOptions, groups);

  return (
    <RHFAutocomplete
      {...props}
      required={required}
      disabled={currencyOptions?.length === 1 || props.disabled}
      className={`Monite-Currency ${hideLabel && 'Monite-Label-Hidden'}`}
      disableClearable={!showClearButton}
      label={currencyLabel}
      options={sortedOptions}
      optionKey="code"
      labelKey={showCodeOnly ? 'code' : 'label'}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          sx: {
            '& .MuiAutocomplete-listbox hr:last-of-type': {
              display: 'none',
            },
          },
        },
      }}
      renderInput={(
        params,
        renderParams?: { error?: FieldError; label: string; required?: boolean }
      ) => (
        <CurrencyInput
          error={renderParams?.error}
          defaultValue={actualCurrency}
          required={renderParams?.required ?? required}
          label={renderParams?.label ?? currencyLabel}
          showCodeOnly={showCodeOnly}
          showCurrencySymbol={showCurrencySymbol}
          showCurrencyCode={showCurrencyCode}
          {...params}
        />
      )}
      renderOption={(props, option) => (
        <CurrencyOption
          key={option.code}
          props={props}
          option={option}
          showCodeOnly={showCodeOnly}
          showCurrencyCode={showCurrencyCode}
          showCurrencySymbol={showCurrencySymbol}
        />
      )}
      filterOptions={filterOptions}
      groupBy={
        groups
          ? (option) => getGroupTitleForOption(option, groups)?.title
          : undefined
      }
      renderGroup={(params) => {
        if (params.group.trim() === '') {
          return params.children;
        }
        return (
          <Fragment key={params.key}>
            <ListSubheader
              component="div"
              title={params.group}
              sx={{
                bgcolor: 'background.paper',
                typography: 'body2',
                fontWeight: (theme) => theme.typography.fontWeightBold,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                py: 1.25,
                px: 2,
                top: -12, // hack needed to align the group title with the first option (MUI handles custom groups poorly)
              }}
            >
              {params.group}
            </ListSubheader>
            {params.children}
            <Divider sx={{ mx: 1, mt: 1 }} />
          </Fragment>
        );
      }}
    />
  );
};
