import { CountryInput } from './CountryInput';
import { CountryOption } from './CountryOption';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { CountryType, getCountriesArray } from '@/core/utils/countries';
import {
  RHFAutocompleteProps,
  RHFAutocomplete,
} from '@/ui/RHF/RHFAutocomplete';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TextFieldProps } from '@mui/material';
import type { AutocompleteRenderInputParams } from '@mui/material';
import { useMemo, useEffect } from 'react';
import {
  type UseControllerProps,
  type FieldValues,
  type FieldPath,
  useController,
} from 'react-hook-form';

export type MoniteCountryProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & {
  disabled?: boolean;
  required?: TextFieldProps['required'];
  label?: string;
  hideLabel?: boolean;
  size?: TextFieldProps['size'];
  fullWidth?: boolean;
  multiple?: RHFAutocompleteProps<TFieldValues, TName, CountryType>['multiple'];
  countryOptions?: CountryType[];
  allowedCountries?: components['schemas']['AllowedCountries'][];
  showFlag?: boolean;
  readOnly?: boolean;
  setDefaultIfOnlyOneCountry?: boolean;
  onChange?: RHFAutocompleteProps<TFieldValues, TName, CountryType>['onChange'];
};

export const MoniteCountry = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  disabled,
  required,
  label,
  hideLabel = false,
  fullWidth,
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  countryOptions: customCountryOptions,
  allowedCountries,
  showFlag = true,
  readOnly,
  setDefaultIfOnlyOneCountry = true,
  onChange: customOnChange,
  ...props
}: MoniteCountryProps<TFieldValues, TName>) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  const { field, fieldState } = useController<TFieldValues, TName>({
    name,
    control,
  });

  const countryLabel = label ?? t(i18n)`Country`;

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <CountryInput
      {...params}
      ref={params.InputProps.ref}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message}
      required={required}
      label={countryLabel}
      currentValue={field.value as CountryType | null}
      showFlag={showFlag}
    />
  );

  const countryOptions = useMemo(() => {
    const baseOptions = customCountryOptions ?? getCountriesArray(i18n);

    if (allowedCountries) {
      return baseOptions.filter((countryItem) =>
        allowedCountries.includes(countryItem.code as AllowedCountries)
      );
    }

    if (componentSettings?.receivables?.bankAccountCountries) {
      return baseOptions.filter((countryItem) =>
        componentSettings.receivables.bankAccountCountries?.includes(
          countryItem.code as AllowedCountries
        )
      );
    }

    return baseOptions;
  }, [componentSettings, customCountryOptions, allowedCountries, i18n]);

  useEffect(() => {
    if (!setDefaultIfOnlyOneCountry) return;

    if (countryOptions?.length === 1 && !field.value) {
      field.onChange(countryOptions[0].code);
    }
  }, [countryOptions, field, setDefaultIfOnlyOneCountry]);

  return (
    <RHFAutocomplete
      {...props}
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      onChange={customOnChange}
      disabled={disabled}
      readOnly={readOnly ?? countryOptions?.length === 1}
      className={`Monite-Country ${hideLabel ? 'Monite-Label-Hidden' : ''}`}
      label={countryLabel}
      options={countryOptions}
      optionKey="code"
      labelKey="label"
      fullWidth={fullWidth}
      renderInput={renderInput}
      renderOption={(props, option, state) => (
        <CountryOption
          key={option.code}
          props={props}
          option={option}
          state={{ inputValue: state?.inputValue ?? '' }}
          showFlag={showFlag}
        />
      )}
    />
  );
};

type AllowedCountries = components['schemas']['AllowedCountries'];
