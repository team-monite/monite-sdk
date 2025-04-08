import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetFinanceOffers = () => {
  const { api } = useMoniteContext();

  return api.financingOffers.getFinancingOffers.useQuery();
};
