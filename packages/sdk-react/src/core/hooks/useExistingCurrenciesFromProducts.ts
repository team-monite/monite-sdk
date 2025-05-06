import { useMemo } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';

/**
 * Custom hook to fetch all products and derive a Set of existing currency codes.
 * @returns An object containing:
 *   - `existingCurrencies`: A Set<string> of currency codes used in product prices.
 *   - `isLoadingProducts`: A flag indicating if the products query is loading.
 */
export const useExistingCurrenciesFromProducts = () => {
  const { api } = useMoniteContext();

  const { data: productsResponse, isLoading: isLoadingProducts } =
    api.products.getProducts.useQuery();

  const existingCurrencies = useMemo(() => {
    return new Set<string>(
      productsResponse?.data
        ?.map((product) => product.price?.currency)
        .filter(
          (currency): currency is components['schemas']['CurrencyEnum'] =>
            !!currency
        ) ?? []
    );
  }, [productsResponse?.data]);

  return { existingCurrencies, isLoadingProducts };
};
