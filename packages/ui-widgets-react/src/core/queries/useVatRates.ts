import { useQuery } from 'react-query';
import { VatRatesService, VatRateListResponse } from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';

const VAT_RATES_QUERY_ID = 'vat_rates';

export const useVATRates = (
  enabled: boolean,
  ...args: Parameters<VatRatesService['getVatRates']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<VatRateListResponse, Error>(
    [VAT_RATES_QUERY_ID, { variables: args }],
    () => monite.api!.vatRates.getVatRates(...args),
    {
      enabled,
    }
  );
};
