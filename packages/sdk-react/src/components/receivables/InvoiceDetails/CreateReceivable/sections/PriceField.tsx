import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

import { useCurrencies } from '@/core/hooks';
import { FormControl, TextField } from '@mui/material';

// works well for currencies such as USD and EUR except for awkward instances
// where e.g. current price is 215,61, if user types an invalid third cent making it e.g.
// 215,618, it will round the value to 215,62 which is unlikely to be the users intention

// there are also some NaN instances that I still need to find and fix
export const PriceField = ({ index, currency }: any) => {
  const {
    formatCurrencyToDisplay,
    formatFromMinorUnits,
    formatToMinorUnits,
    getSymbolFromCurrency,
  } = useCurrencies();

  return (
    <Controller
      name={`line_items.${index}.price.value`}
      render={({ field: controllerField, fieldState: { error } }) => {
        const [isTyping, setIsTyping] = useState(false);
        const [rawValue, setRawValue] = useState<string | number>(
          controllerField.value
        );

        useEffect(() => {
          if (!isTyping) {
            setRawValue(
              formatCurrencyToDisplay(controllerField.value, currency, false) ||
                ''
            );
          }
        }, [controllerField.value]);

        const handleBlur = (e) => {
          let inputValue = String(rawValue).trim();
          const lastCommaIndex = inputValue.lastIndexOf(',');
          const lastDotIndex = inputValue.lastIndexOf('.');

          if (
            //commas can apparently be used only for thousand separators while cents must be separated by dots
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
          const formattedToMinorUnits = formatToMinorUnits(
            inputValue,
            currency
          );
          console.log({ inputValue });

          if (
            inputValue === '' ||
            isNaN(parsedValue) ||
            (formattedToMinorUnits && isNaN(formattedToMinorUnits))
          ) {
            controllerField.onChange(0);
            setRawValue(formatCurrencyToDisplay(0, currency, false));
          } else {
            console.log({ formattedToMinorUnits });
            const newValue = formatCurrencyToDisplay(
              formattedToMinorUnits || 0,
              currency,
              false
            );
            console.log({ newValue });
            controllerField.onChange(formattedToMinorUnits);
            setRawValue(newValue || 0); //cannot use inputValue directly due to e.g. 02.02 euro
          }

          setIsTyping(false);
          controllerField.onBlur();
        };

        return (
          <FormControl
            variant="standard"
            fullWidth
            required
            error={Boolean(error)}
          >
            <TextField
              size="small"
              type="text"
              value={
                isTyping
                  ? rawValue
                  : formatCurrencyToDisplay(
                      controllerField.value,
                      currency,
                      false
                    )
              }
              sx={{ minWidth: 100 }}
              placeholder={'0'}
              onBlur={handleBlur}
              onFocus={() => {
                setIsTyping(true);
              }}
              name={controllerField.name}
              inputRef={controllerField.ref}
              InputProps={{
                startAdornment: getSymbolFromCurrency(currency),
              }}
              onChange={(e) => {
                setRawValue(e.target.value);
              }}
            />
          </FormControl>
        );
      }}
    />
  );
};
