import React from 'react';
import { Controller } from 'react-hook-form';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { FormControlLabel, Switch } from '@mui/material';

interface RHFSwitchProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string | React.ReactNode;
}

export const RHFSwitch = <F extends FieldValues>({
  control,
  name,
  label,
  ...other
}: RHFSwitchProps<F>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControlLabel
          {...other}
          {...field}
          id={name}
          label={label}
          control={<Switch {...field} />}
        />
      )}
    />
  );
};
