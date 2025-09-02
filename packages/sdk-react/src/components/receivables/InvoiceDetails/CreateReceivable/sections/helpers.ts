import { useCurrencies } from '@/core/hooks';
import { components } from '@/api';

export const usePriceHelper = () => {
  const { formatCurrencyToDisplay, formatToMinorUnits } = useCurrencies();

  const sanitizeAndFormatValue = (inputValue: string, currency: CurrencyEnum) => {
    let sanitizedValue = inputValue.replace(/[^0-9.,]/g, '');

    // Handle comma and dot formatting for decimals
    const lastCommaIndex = sanitizedValue.lastIndexOf(',');
    const lastDotIndex = sanitizedValue.lastIndexOf('.');

    if (
      lastCommaIndex > -1 &&
      (lastDotIndex === -1 || lastCommaIndex > lastDotIndex) &&
      sanitizedValue.slice(lastCommaIndex + 1).length === 2 &&
      !sanitizedValue.slice(lastCommaIndex + 1).includes(',')
    ) {
      sanitizedValue =
        sanitizedValue.slice(0, lastCommaIndex) +
        '.' +
        sanitizedValue.slice(lastCommaIndex + 1);
    }

    const parsedValue = parseFloat(sanitizedValue.replace(/[^0-9.-]/g, ''));
    const formattedToMinorUnits = formatToMinorUnits(sanitizedValue, currency);

    if (
      inputValue === '' ||
      isNaN(parsedValue) ||
      (formattedToMinorUnits && isNaN(formattedToMinorUnits))
    ) {
      return {
        displayValue: formatCurrencyToDisplay(0, currency, false) || '',
        minorUnitsValue: 0,
      };
    } else {
      const newValue = formatCurrencyToDisplay(
        formattedToMinorUnits || 0,
        currency,
        false
      );
      return {
        displayValue: newValue || '',
        minorUnitsValue: formattedToMinorUnits,
      };
    }
  };

  return { sanitizeAndFormatValue };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
