import { ChangeEvent, useEffect, useState, FocusEvent } from 'react';

import { useCurrencies } from '@/core/hooks';
import { InputAdornment, TextField } from '@mui/material';

interface PriceFieldProps {
  value?: number;
  error?: boolean;
  currency: string;
  disabled?: boolean;
  onChange: (newValue: number) => void;
}

export const PriceField = ({
  value,
  error = false,
  currency,
  disabled = false,
  onChange,
}: PriceFieldProps) => {
  const { getSymbolFromCurrency } = useCurrencies();

  const minorToMajor = (minorValue?: number): string => {
    if (minorValue === undefined) return '';
    return (minorValue / 100).toFixed(2);
  };

  const majorToMinor = (majorValue: string): number => {
    if (majorValue === '' || majorValue === '0') return 0;
    const numValue = parseFloat(majorValue);
    if (isNaN(numValue)) return 0;
    return Math.round(numValue * 100);
  };

  const [inputValue, setInputValue] = useState<string>(minorToMajor(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Only update the input value from the value prop if the input is not focused
    // and the prop-derived value actually differs from the current input value.
    // This prevents resetting the input (and cursor position) while the user is actively typing.
    if (!isFocused) {
      const majorValue = minorToMajor(value);
      if (majorValue !== inputValue) {
        setInputValue(majorValue);
      }
    }
  }, [value, isFocused, inputValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    // Immediate reformatting is avoided here to allow the user to type freely (e.g., decimals).
    // The final parsing, formatting, and calling onChange occur on blur.
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    let valueToProcess = e.target.value;

    try {
      const parsed = parseFloat(valueToProcess);
      if (!isNaN(parsed)) {
        valueToProcess = parsed.toFixed(2);
      } else {
        valueToProcess = '0.00';
      }
    } catch {
      valueToProcess = '0.00';
    }
    setInputValue(valueToProcess);

    const minorValue = majorToMinor(valueToProcess);
    onChange(minorValue);
  };

  return (
    <TextField
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // Using type="text" is intentional to allow more flexible input patterns (like leading/trailing decimals during typing)
      // and to maintain control over formatting, which might be lost with type="number".
      type="text"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {getSymbolFromCurrency(currency) || currency}
          </InputAdornment>
        ),
      }}
      inputProps={{
        inputMode: 'decimal',
        pattern: '[0-9]*(.[0-9]+)?',
        min: 0,
        step: '0.01',
      }}
      fullWidth
      size="small"
      error={error}
      disabled={disabled}
    />
  );
};
