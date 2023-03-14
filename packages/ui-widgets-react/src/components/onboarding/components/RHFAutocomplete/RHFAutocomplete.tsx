import React from 'react';
import { Autocomplete, AutocompleteValue, TextField } from '@mui/material';
import type {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material';

import { Controller } from 'react-hook-form';

import type {
  FieldValues,
  FieldError,
  UseControllerProps,
} from 'react-hook-form';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface RHFAutocompleteProps<T> extends UseControllerProps<T> {
  label: string;
}

interface CustomAutocompleteProps<A>
  extends AutocompleteProps<
    A,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  > {
  optionKey?: keyof A;
  labelKey?: keyof A;
}

type CustomAutocompleteValue<A> = AutocompleteValue<
  A,
  boolean | undefined,
  boolean | undefined,
  boolean | undefined
>;

const RHFAutocomplete = <F extends FieldValues, A>({
  control,
  name,
  label,
  renderInput,
  optionKey,
  labelKey,
  options,
  ...other
}: RHFAutocompleteProps<F> &
  Optional<CustomAutocompleteProps<A>, 'renderInput'>) => {
  const getRenderInput = (error?: FieldError) => {
    if (renderInput) return renderInput;

    return (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        label={label}
        error={!!error?.message}
        helperText={error?.message}
        inputProps={{
          ...params.inputProps,
        }}
      />
    );
  };

  const getChangedValue = (
    value: CustomAutocompleteValue<A>
  ): CustomAutocompleteValue<A> => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value;
    if (optionKey) return String(value[optionKey]);
    return value;
  };

  /**
   * getValue is used to get value from options
   * !!! Note !!! now we support only single value, but we should support multiple values
   */
  const getValue = (value: CustomAutocompleteValue<A>): A | A[] | null => {
    if (!value) return null;

    if (optionKey)
      return (
        options.find((option) => String(option[optionKey]) === String(value)) ??
        null
      );

    return options.find((option) => String(option) === String(value)) ?? null;
  };

  const getOptionLabel = (option: string | A): string => {
    if (typeof option === 'string') return option;
    if (!labelKey) return '';
    return `${option[labelKey]}`;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field,
        fieldState: { error, isTouched },
        formState: { isValid },
      }) => (
        <Autocomplete
          {...field}
          {...other}
          options={options}
          blurOnSelect
          onChange={(_, value) => field.onChange(getChangedValue(value))}
          value={getValue(field.value)}
          id={name}
          getOptionLabel={getOptionLabel}
          renderInput={getRenderInput(
            isTouched || !isValid ? error : undefined
          )}
        />
      )}
    />
  );
};

export default RHFAutocomplete;
