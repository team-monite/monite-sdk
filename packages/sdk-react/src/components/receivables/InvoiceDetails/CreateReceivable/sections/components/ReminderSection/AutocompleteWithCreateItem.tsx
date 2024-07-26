import React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  type AutocompleteRenderInputParams,
  MenuItem,
  TextField,
} from '@mui/material';

interface AutocompleteWithCreateItemProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  options: Array<{ value: string | number; label: string }>;
  createOptionLabel?: string;
  createOptionDisabled?: boolean;
  noOptionsText: string;
  onCreate: () => void;
}

export const AutocompleteWithCreateItem = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  label,
  disabled,
  options,
  createOptionLabel,
  createOptionDisabled,
  onCreate,
  control,
  rules,
  shouldUnregister,
  noOptionsText,
  defaultValue,
}: AutocompleteWithCreateItemProps<TFieldValues, TName>) => {
  const optionsWithCreate = [
    ...(createOptionLabel
      ? [{ value: 'create', label: createOptionLabel }]
      : []),
    ...options,
  ];

  const { root } = useRootElements();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error, isTouched, invalid } }) => (
        <Autocomplete
          {...field}
          value={options.find(({ value }) => value === field.value) ?? null}
          multiple={false}
          options={optionsWithCreate}
          noOptionsText={noOptionsText}
          slotProps={{ popper: { container: root } }}
          onChange={(_, value) => {
            if (value?.value === 'create') return void onCreate();
            field.onChange(value?.value ?? null);
          }}
          getOptionDisabled={(option) =>
            option.value === 'create' ? Boolean(createOptionDisabled) : false
          }
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              {...params}
              label={label}
              error={isTouched && invalid}
              helperText={error?.message}
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
          getOptionLabel={(option) => {
            if (!option.value) return '';
            if (option.value === 'create') return createOptionLabel ?? '';
            return option.label || '—';
          }}
          renderOption={(props, option) => (
            <MenuItem
              {...props}
              key={option.value}
              value={option.value}
              disabled={createOptionDisabled}
              sx={
                option.value === 'create'
                  ? {
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      color: 'primary.main',
                      whiteSpace: 'unset',
                    }
                  : {
                      whiteSpace: 'unset',
                    }
              }
            >
              {option.value === 'create' && <AddIcon sx={{ marginRight: 1 }} />}
              {option.label}
            </MenuItem>
          )}
        />
      )}
    />
  );
};
