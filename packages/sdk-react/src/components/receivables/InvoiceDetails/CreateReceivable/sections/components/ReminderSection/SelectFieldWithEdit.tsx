import React from 'react';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  type AutocompleteRenderInputParams,
  Button,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';

import { ReminderDetail, ReminderDetails } from './ReminderDetail';

interface CustomSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  options: Array<{ id: string | number; name: string }>;
  createOptionLabel: string;
  details: ReminderDetail | undefined;
  noOptionsText: string;
  onEdit: () => void;
  onCreate: () => void;
}

export const SelectFieldWithEdit = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  label,
  disabled,
  options,
  details,
  createOptionLabel,
  onEdit,
  onCreate,
  control,
  rules,
  shouldUnregister,
  noOptionsText,
  defaultValue,
}: CustomSelectFieldProps<TFieldValues, TName>) => {
  const { i18n } = useLingui();

  const optionsMap = [
    { value: 'create', label: createOptionLabel },
    ...options.map(({ id, name }) => ({ value: id, label: name })),
  ].reduce<Record<string | 'create', string>>((acc, { value, label }) => {
    acc[value] = label;
    return acc;
  }, {});

  const { root } = useRootElements();

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={10}>
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
              value={field.value}
              multiple={false}
              options={Object.keys(optionsMap)}
              noOptionsText={noOptionsText}
              onChange={(_, value) => {
                if (value === 'create') return void onCreate();
                if (value) field.onChange(value);
              }}
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
                if (option === '') return '';
                return optionsMap[option];
              }}
              renderOption={(props, option) => {
                return (
                  <MenuItem
                    {...props}
                    key={option}
                    value={option}
                    sx={
                      option === 'create'
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
                    {option === 'create' && <AddIcon sx={{ marginRight: 1 }} />}
                    {optionsMap[option]}
                  </MenuItem>
                );
              }}
              slotProps={{ popper: { container: root } }}
            />
          )}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="outlined"
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();
            onEdit();
          }}
          fullWidth
          style={{ height: 50 }}
        >
          {t(i18n)`Edit`}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <ReminderDetails details={details} />
      </Grid>
    </Grid>
  );
};
