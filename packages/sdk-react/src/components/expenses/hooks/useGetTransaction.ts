import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetTransaction = (transaction_id?: string) => {
  const { api } = useMoniteContext();

  return api.transactions.getTransactionsId.useQuery(
    { path: { transaction_id: transaction_id ?? '' } },
    { enabled: !!transaction_id }
  );
};
