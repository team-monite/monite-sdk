import { ChangeEvent, FormEvent } from 'react';

import { InputAdornment, TextField } from '@mui/material';

import { processTaxRateValue, formatTaxRate } from '../../utils';

interface TaxRateFieldProps {
  value?: number;
  error?: boolean;
  disabled?: boolean;
  onModified?: () => void;
  onChange: (newRate?: number) => void;
  onBlur?: () => void;
}

export const TaxRateField = ({
  value,
  error,
  disabled = false,
  onModified,
  onChange,
  onBlur,
}: TaxRateFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // If the field is empty, pass undefined to trigger required validation
    if (inputValue === '') {
      onChange(undefined);
      onModified?.();
      return;
    }
    
    const processedValue = processTaxRateValue(inputValue);
    onChange(processedValue);
    onModified?.();
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    formatTaxRate(e.target as HTMLInputElement);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <TextField
      value={value ?? ''}
      type="number"
      inputProps={{
        min: 0,
        max: 100,
        step: 'any',
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      size="small"
      error={error}
      disabled={disabled}
      onChange={handleChange}
      onInput={handleInput}
      onBlur={handleBlur}
      sx={{
        width: '120px',
      }}
    />
  );
};
