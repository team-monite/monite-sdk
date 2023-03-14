import { useCurrencyList } from 'core/queries/useCurrency';
import { useCallback } from 'react';

export const useCurrencies = () => {
  const { data: currencyList } = useCurrencyList();

  const getSymbolFromCurrency = (currency: string) => {
    if (!currencyList || !currencyList[currency]) return currency;
    return currencyList[currency].symbol;
  };

  const formatFromMinorUnits = useCallback(
    (amount: number, currency: string): number | null => {
      const currencyData = currencyList && currencyList[currency];

      if (currencyData) {
        switch (currencyData.minor_units) {
          case 0:
            return amount;
          case 3:
            return Number((amount / 1000).toFixed(3));
          case 2:
            return Number((amount / 100).toFixed(2));
          default:
            return amount;
        }
      }

      return null;
    },
    [currencyList]
  );

  const formatToMinorUnits = useCallback(
    (amount: string | number, currency: string): number | null => {
      const currencyData = currencyList && currencyList[currency];

      if (currencyData) {
        switch (currencyData.minor_units) {
          case 0:
            return Number(amount);
          case 3:
            return Number(amount) * 1000;
          case 2:
            return Number(amount) * 100;
          default:
            return Number(amount);
        }
      }

      return null;
    },
    [currencyList]
  );

  const formatCurrencyToDisplay = (
    amount: string | number,
    currency: string
  ) => {
    const currencyData = currencyList && currencyList[currency];
    const amountFromMinorUnits = formatFromMinorUnits(Number(amount), currency);

    if (currencyData && amountFromMinorUnits) {
      const formatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency,
      });

      return formatter.format(amountFromMinorUnits);
    }

    return null;
  };

  return {
    getSymbolFromCurrency,
    formatCurrencyToDisplay,
    formatToMinorUnits,
    formatFromMinorUnits,
  };
};

export default useCurrencies;
