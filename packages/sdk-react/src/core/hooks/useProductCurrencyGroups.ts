import { useMemo } from 'react';

import { CurrencyGroup } from '@/core/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useExistingCurrenciesFromProducts } from './useExistingCurrenciesFromProducts';

/**
 * Custom hook that provides a standard currency group list based on existing product currencies.
 * Defines groups for "You have items in" and "No items created in".
 * @returns An object containing:
 *   - `currencyGroups`: An array containing definitions for both groups.
 *   - `isLoadingCurrencyGroups`: A flag indicating if the underlying products query is loading.
 */
export const useProductCurrencyGroups = () => {
  const { i18n } = useLingui();
  const { existingCurrencies, isLoadingProducts } =
    useExistingCurrenciesFromProducts();

  const currencyGroups: CurrencyGroup[] = useMemo(() => {
    return [
      {
        title: t(i18n)`You have items in`,
        predicate: (option) => existingCurrencies.has(option.code),
      },
      {
        title: t(i18n)`No items created in`,
        predicate: (option) => !existingCurrencies.has(option.code),
      },
    ];
  }, [existingCurrencies, i18n]);

  return { currencyGroups, isLoadingCurrencyGroups: isLoadingProducts };
};
