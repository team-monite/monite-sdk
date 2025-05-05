import * as React from 'react';

import { CountryType } from '@/core/utils/countries';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

import { CountryFlag } from './CountryFlag';

export type CountryInputProps = TextFieldProps & {
  showFlag?: boolean;
  currentValue?: CountryType | null;
  helperText?: string;
};

export const CountryInput = React.forwardRef<HTMLDivElement, CountryInputProps>(
  (
    {
      showFlag = true,
      currentValue,
      label,
      required,
      InputProps,
      inputProps,
      error,
      helperText,
      ...rest
    },
    ref
  ) => (
    <TextField
      {...rest}
      ref={ref}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      inputProps={{
        ...inputProps,
        autoComplete: 'new-password',
      }}
      InputProps={{
        ...InputProps,
        startAdornment:
          showFlag && currentValue && typeof currentValue.code === 'string' ? (
            <InputAdornment position="start" sx={{ ml: 1, mr: -0.5 }}>
              <CountryFlag
                code={currentValue.code}
                label={currentValue.label || currentValue.code}
              />
            </InputAdornment>
          ) : (
            InputProps?.startAdornment
          ),
      }}
    />
  )
);
