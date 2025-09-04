import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetPaymentRecords = (id?: string) => {
  const { api } = useMoniteContext();

  return api.paymentRecords.getPaymentRecords.useQuery(
    { query: { object_id: id ?? '' } },
    { enabled: !!id }
  );
};
