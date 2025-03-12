import { useEffect, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { useCurrencies } from '@/core/hooks';
import { FormControl, TextField } from '@mui/material';

// works well for currencies such as USD and EUR except for awkward instances
// where e.g. current price is 215,61, if user types an invalid third cent making it e.g.
// 215,618, it will round the value to 215,62 which is unlikely to be the users intention
export const PriceField = ({ index, currency, disabled, control }: any) => {
  const { formatCurrencyToDisplay, formatToMinorUnits, getSymbolFromCurrency } =
    useCurrencies();

  const fieldValue = useWatch({
    control,
    name: `line_items.${index}.product.price.value`,
  });

  const [isTyping, setIsTyping] = useState(false);
  const [rawValue, setRawValue] = useState<string | number>('');

  useEffect(() => {
    if (!isTyping) {
      const formattedValue = formatCurrencyToDisplay(
        fieldValue,
        currency,
        false
      );
      setRawValue(formattedValue || '');
    }
  }, [fieldValue, currency, formatCurrencyToDisplay, isTyping]);

  const handleBlur = (controllerField: any) => {
    let inputValue = String(rawValue).trim();
    const lastCommaIndex = inputValue.lastIndexOf(',');
    const lastDotIndex = inputValue.lastIndexOf('.');

    // Handle comma and dot formatting for decimals
    if (
      lastCommaIndex > -1 &&
      (lastDotIndex === -1 || lastCommaIndex > lastDotIndex) &&
      inputValue.slice(lastCommaIndex + 1).length === 2 &&
      !inputValue.slice(lastCommaIndex + 1).includes(',')
    ) {
      inputValue =
        inputValue.slice(0, lastCommaIndex) +
        '.' +
        inputValue.slice(lastCommaIndex + 1);
    }

    const parsedValue = parseFloat(inputValue.replace(/[^0-9.-]/g, ''));
    const formattedToMinorUnits = formatToMinorUnits(inputValue, currency);

    if (
      inputValue === '' ||
      isNaN(parsedValue) ||
      (formattedToMinorUnits && isNaN(formattedToMinorUnits))
    ) {
      controllerField.onChange(0);
      setRawValue(formatCurrencyToDisplay(0, currency, false) || '');
    } else {
      const newValue = formatCurrencyToDisplay(
        formattedToMinorUnits || 0,
        currency,
        false
      );
      controllerField.onChange(formattedToMinorUnits);
      setRawValue(newValue || 0); // Use formatted value to avoid issues like "02.02"
    }

    setIsTyping(false);
    controllerField.onBlur();
  };

  return (
    <Controller
      name={`line_items.${index}.product.price.value`}
      control={control}
      disabled={disabled}
      render={({ field: controllerField, fieldState: { error } }) => (
        <FormControl
          variant="standard"
          fullWidth
          required
          error={Boolean(error)}
          disabled={disabled}
        >
          <TextField
            size="small"
            type="text"
            disabled={disabled}
            value={
              isTyping
                ? rawValue
                : formatCurrencyToDisplay(fieldValue, currency, false)
            }
            sx={{ minWidth: 100 }}
            placeholder={'0'}
            onBlur={() => handleBlur(controllerField)}
            onFocus={() => setIsTyping(true)}
            name={controllerField.name}
            inputRef={controllerField.ref}
            InputProps={{
              startAdornment: getSymbolFromCurrency(currency),
            }}
            onChange={(e) => setRawValue(e.target.value)}
          />
        </FormControl>
      )}
    />
  );
};
