import {
  useEffect,
  useState,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
} from 'react';

import { useCurrencies } from '@/core/hooks';
import { useLingui } from '@lingui/react';
import { InputAdornment, TextField } from '@mui/material';

import { parseLocaleNumericString } from '../../utils';

interface PriceFieldProps {
  value?: number;
  error?: boolean;
  currency: string;
  disabled?: boolean;
  locale?: string;
  onChange: (newValue: number) => void;
}

export const PriceField = ({
  value,
  error = false,
  currency,
  disabled = false,
  onChange,
  locale: propLocale,
}: PriceFieldProps) => {
  const { getSymbolFromCurrency } = useCurrencies();
  const { i18n } = useLingui();

  const locale = propLocale ?? i18n.locale;

  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [locale]);

  const normalizeMajorValue = (val?: number): number =>
    typeof val === 'number' && !Number.isNaN(val) ? val : 0;

  const [inputValue, setInputValue] = useState<string>(
    numberFormatter.format(normalizeMajorValue(value))
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Only update the input value from the value prop if the input is not focused
    // and the prop-derived value actually differs from the current input value.
    // This prevents resetting the input (and cursor position) while the user is actively typing.
    if (!isFocused) {
      const majorValue = numberFormatter.format(normalizeMajorValue(value));

      if (majorValue !== inputValue) {
        setInputValue(majorValue);
      }
    }
  }, [value, isFocused, locale, numberFormatter, inputValue]);

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

    const currentVal = e.target.value.trim();

    if (currentVal === '') {
      setInputValue(numberFormatter.format(0));
      onChange(0);

      return;
    }

    const majorValue = parseLocaleNumericString(currentVal, locale);

    if (typeof value === 'number' && value === majorValue) {
      return;
    }

    setInputValue(numberFormatter.format(majorValue));
    onChange(majorValue);
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
