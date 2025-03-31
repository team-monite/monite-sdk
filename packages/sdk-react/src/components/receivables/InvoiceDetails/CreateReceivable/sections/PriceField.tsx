import { useState } from 'react';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { useCurrencies } from '@/core/hooks';
import { FormControl, TextField } from '@mui/material';

import { CreateReceivablesFormBeforeValidationProps } from '../validation';
import { usePriceHelper } from './helpers';

interface PriceFieldProps {
  index: number;
  currency: string;
  error: boolean;
}

export const PriceField = ({ index, currency, error }: PriceFieldProps) => {
  const { formatCurrencyToDisplay, getSymbolFromCurrency } = useCurrencies();
  const { sanitizeAndFormatValue } = usePriceHelper();

  const { control } =
    useFormContext<CreateReceivablesFormBeforeValidationProps>();

  const productPrice = useWatch({
    control,
    name: `line_items.${index}.product.price.value`,
  });

  const price = useWatch({
    control,
    name: `line_items.${index}.price.value`,
  });

  const fieldValue = productPrice ?? price;

  const [isTyping, setIsTyping] = useState(false);
  const [rawValue, setRawValue] = useState<string>('');

  const cleanValue = (inputValue: string): string => {
    // remove all non-digit characters except the first decimal point
    let cleanedValue = inputValue.replace(/[^\d.,]/g, '');

    // replace commas with nothing (e.g., "20,000" -> "20000")
    // this is to avoid NaN, if it seems safe you can try removing
    cleanedValue = cleanedValue.replace(/,/g, '');

    // ensure only one decimal point exists
    const decimalParts = cleanedValue.split('.');
    if (decimalParts.length > 1) {
      cleanedValue = `${decimalParts[0]}.${decimalParts.slice(1).join('')}`;
    }

    // ff the value is empty or invalid, default to "0"
    if (!cleanedValue || isNaN(Number(cleanedValue))) {
      return '0';
    }

    return cleanedValue;
  };

  const handleBlur = (
    controllerField: ControllerRenderProps<
      CreateReceivablesFormBeforeValidationProps,
      `line_items.${any}.product.price.value`
    >
  ) => {
    const cleanedValue = cleanValue(rawValue.trim());

    // format the cleaned value
    const { displayValue, minorUnitsValue } = sanitizeAndFormatValue(
      cleanedValue,
      currency
    );

    if (minorUnitsValue !== null) {
      controllerField.onChange(minorUnitsValue); // update form value
      setRawValue(displayValue); // update displayed value
    } else {
      // if the input is invalid or empty, reset to 0.00
      controllerField.onChange(0);
      setRawValue(formatCurrencyToDisplay(0, currency, false) || '');
    }

    setIsTyping(false);
    controllerField.onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const decimalParts = inputValue.split('.');
    if (decimalParts.length > 1 && decimalParts[1].length > 2) {
      const truncatedValue = `${decimalParts[0]}.${decimalParts[1].slice(
        0,
        2
      )}`;
      setRawValue(truncatedValue);
    } else {
      setRawValue(inputValue);
    }
  };

  return (
    <Controller
      name={`line_items.${index}.product.price.value`}
      control={control}
      render={({
        field: controllerField,
        fieldState: { error: fieldError },
      }) => (
        <FormControl
          variant="standard"
          fullWidth
          required
          error={Boolean(error || fieldError)}
        >
          <TextField
            size="small"
            type="text"
            error={Boolean(error || fieldError)}
            value={
              isTyping
                ? rawValue
                : formatCurrencyToDisplay(fieldValue, currency, false)
            }
            sx={{ minWidth: 100 }}
            placeholder="0"
            onBlur={() => handleBlur(controllerField)}
            onFocus={(event) => {
              setIsTyping(true);
              event.target.select();

              setRawValue(
                formatCurrencyToDisplay(fieldValue, currency, false) || ''
              );
            }}
            name={controllerField.name}
            inputRef={controllerField.ref}
            InputProps={{
              startAdornment: getSymbolFromCurrency(currency),
            }}
            onChange={handleChange}
          />
        </FormControl>
      )}
    />
  );
};
