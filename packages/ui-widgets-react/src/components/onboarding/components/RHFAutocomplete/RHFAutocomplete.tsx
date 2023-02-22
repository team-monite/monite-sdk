import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
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

interface CustomAutoCompleteProps<T>
  extends AutocompleteProps<
    T,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  > {
  optionKey?: keyof T;
}

const RHFAutocomplete = <F extends FieldValues, A>({
  control,
  name,
  label,
  renderInput,
  optionKey,
  options,
  ...other
}: RHFAutocompleteProps<F> &
  Optional<CustomAutoCompleteProps<A>, 'renderInput'>) => {
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
  const getChangedValue = (value: any) => {
    if (value === '') return null;
    if (optionKey) return value[optionKey];
    return value;
  };

  const getDefaultValue = (value: any): A | null => {
    if (value === '') return null;
    if (optionKey)
      return options.find((option) => option[optionKey] === value) ?? null;

    return options.find((option) => option === value) ?? null;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          {...other}
          options={options}
          blurOnSelect
          onChange={(_, value) => field.onChange(getChangedValue(value))}
          value={getDefaultValue(field.value)}
          id={name}
          renderInput={getRenderInput(error)}
        />
      )}
    />
  );
};

export default RHFAutocomplete;
