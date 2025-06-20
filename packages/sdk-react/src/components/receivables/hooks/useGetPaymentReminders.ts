import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetPaymentReminders = () => {
  const { api } = useMoniteContext();

  return api.paymentReminders.getPaymentReminders.useQuery(undefined, {
    select: (data) =>
      data.data.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
  });
};
