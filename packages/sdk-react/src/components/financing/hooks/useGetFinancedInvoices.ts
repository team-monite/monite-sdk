import { Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetFinancedInvoices = (
  query: Services['financingInvoices']['getFinancingInvoices']['types']['parameters']['query'],
  enabled = true
) => {
  const { api } = useMoniteContext();

  return api.financingInvoices.getFinancingInvoices.useQuery(
    {
      query,
    },
    { enabled }
  );
};
