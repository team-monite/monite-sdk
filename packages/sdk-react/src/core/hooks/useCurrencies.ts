import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import { components } from '@/api';
import { getLegacyAPIErrorMessage } from '@/core/utils/getLegacyAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useMoniteContext } from '../context/MoniteContext';

/**
 * `useCurrencies` hook used for working with currencies
 *  - Display price based on amount, currency and locale.code parameters
 *  - Convert minor units into main currency and vise-versa
 */
export const useCurrencies = () => {
  const { locale, api } = useMoniteContext();
  const {
    data: currencyList,
    isSuccess,
    isError,
    error,
  } = api.internal.getInternalCurrencies.useQuery({});
  const { i18n } = useLingui();

  //TODO: Remove this error handling and replace with proper error handling
  useEffect(() => {
    if (isError) {
      toast.error(
        getLegacyAPIErrorMessage(error) ||
          t(i18n)`Error occurred in currencies fetching`
      );
    }
  }, [isError, error, i18n]);

  /**
   * Returns currency symbol when we provide currency code
   *
   * ## Example
   * ```typescript
   * const { getSymbolFromCurrency } = useCurrency();
   *
   * // Returns $
   * const dollarSign = getSymbolFromCurrency(CurrencyEnum.USD);
   * ```
   */
  const getSymbolFromCurrency = (currency: CurrencyEnum | string) => {
    if (!currencyList || !currencyList[currency]) return currency;
    return currencyList[currency]?.symbol;
  };

  /**
   * Convert minor units into main currency
   * E.g.
   *  - 1 dollar (main currency) = 100 cents (minor units)
   *  - 1 euro (main currency) = 100 cents (minor units)
   *  - 1 Japanese yen (main currency) have no minor units = 1 minor unit
   *
   * @returns Main currency or `null` if this currency is not in the list
   */
  const formatFromMinorUnits = useCallback(
    (amount: number, currency: CurrencyEnum | string): number | null => {
      const currencyData = currencyList && currencyList[currency];

      if (currencyData) {
        return Number(
          (amount / Math.pow(10, currencyData.minor_units)).toFixed(
            currencyData.minor_units
          )
        );
      }

      return null;
    },
    [currencyList]
  );

  /**
   * Convert main currency into minor units
   *  (backward operation to `formatFromMinorUnits`)
   *
   * @returns Minor units or `null` if this currency is not in the list
   */
  const formatToMinorUnits = useCallback(
    (
      amount: string | number,
      currency: CurrencyEnum | string
    ): number | null => {
      const currencyData = currencyList && currencyList[currency];

      if (currencyData) {
        return Number(amount) * Math.pow(10, currencyData.minor_units);
      }

      return null;
    },
    [currencyList]
  );

  /**
   * Returns a price which should be displayed
   *  based on `amount`, currency` and user `currencyLocale`
   *  that customer provided in `MoniteSDK` on initialization
   *
   * !!! Note !!!
   * Accepts minor units on enter! See example for more information
   *
   * ## Example
   * ```typescript
   * const { formatCurrencyToDisplay } = useCurrencies();
   *
   * // Returns `100,00 €` or `€100.00` based on `currencyLocale`
   * //  it returns 100 but not 100000 because `formatCurrencyToDisplay`
   * //  accepts minor units but returns a main currency
   * const price = formatCurrencyToDisplay(10000, CurrencyEnum.EUR);
   *
   * // Returns `null` because 'unavailable' locale is not supported
   * const price2 = formatCurrencyToDisplay(100, 'unavailable');
   * ```
   */
  const formatCurrencyToDisplay = (
    amountInMinorUnits: string | number,
    currency: CurrencyEnum | string
  ): string | null => {
    const currencyData = currencyList && currencyList[currency];
    const amountFromMinorUnits = formatFromMinorUnits(
      Number(amountInMinorUnits),
      currency
    );

    if (currencyData && amountFromMinorUnits !== null) {
      const formatter = new Intl.NumberFormat(
        locale.currencyNumberFormat.localeCode,
        {
          style: 'currency',
          currencyDisplay: locale.currencyNumberFormat.display,
          currency,
        }
      );

      return formatter.format(amountFromMinorUnits);
    }

    return null;
  };

  return {
    currencyList,
    getSymbolFromCurrency,
    formatCurrencyToDisplay,
    formatToMinorUnits,
    formatFromMinorUnits,
    isSuccess,
  };
};

type CurrencyEnum = components['schemas']['CurrencyEnum'];
