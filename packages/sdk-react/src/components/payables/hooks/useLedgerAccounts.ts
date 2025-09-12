import { useMoniteContext } from '@/core/context/MoniteContext';

export const useLedgerAccounts = (enabled = true) => {
  const { api } = useMoniteContext();
  
  return api.ledgerAccounts.getLedgerAccounts.useQuery(
    {
      query: {
        limit: 100,
        sort: 'name',
      },
    },
    { 
      enabled,
      staleTime: 5 * 60 * 1000,
    }
  );
};