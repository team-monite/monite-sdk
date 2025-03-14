import { useEffect, useState } from 'react';
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

export const PriceField = ({ index, currency }: any) => {
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

  const fieldValue = productPrice !== undefined ? productPrice : price;

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

  const handleBlur = (
    controllerField: ControllerRenderProps<
      CreateReceivablesFormBeforeValidationProps,
      `line_items.${any}.product.price.value`
    >
  ) => {
    const { displayValue, minorUnitsValue } = sanitizeAndFormatValue(
      String(rawValue).trim(),
      currency
    );

    if (minorUnitsValue !== null) {
      controllerField.onChange(minorUnitsValue);
      setRawValue(displayValue);
    }

    setIsTyping(false);
    controllerField.onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const { displayValue } = sanitizeAndFormatValue(inputValue, currency);
    setRawValue(displayValue);
  };

  return (
    <Controller
      name={`line_items.${index}.product.price.value`}
      control={control}
      render={({ field: controllerField, fieldState: { error } }) => (
        <FormControl
          variant="standard"
          fullWidth
          required
          error={Boolean(error)}
        >
          <TextField
            size="small"
            type="text"
            error={Boolean(error)}
            value={
              isTyping
                ? rawValue
                : formatCurrencyToDisplay(fieldValue, currency, false)
            }
            sx={{ minWidth: 100 }}
            placeholder="0"
            onBlur={() => handleBlur(controllerField)}
            onFocus={() => setIsTyping(true)}
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
