import { useMoniteContext } from '../context/MoniteContext';

export const usePaymentIntentById = (payment_intent_id: string) => {
  const { api } = useMoniteContext();

  return api.paymentIntents.getPaymentIntentsId.useQuery({
    path: {
      payment_intent_id,
    },
  });
};
