import { VatRatesService, VatRateListResponse } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

const VAT_RATES_QUERY_ID = 'vat_rates';

const vatRatesQueryKeys = {
  all: () => [VAT_RATES_QUERY_ID],
};

/** Get Vat Rates */
export const useVatRates = (
  params?: Parameters<VatRatesService['getAll']>[0]
) => {
  const { monite } = useMoniteContext();

  return useQuery<VatRateListResponse, Error>(
    [...vatRatesQueryKeys.all(), params],
    () => monite.api.vatRates.getAll(params)
  );
};
