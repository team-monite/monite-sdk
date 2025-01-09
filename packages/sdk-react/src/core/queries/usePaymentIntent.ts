import { useMoniteContext } from '../context/MoniteContext';

export const usePaymentIntentById = (payment_intent_id: string) => {
  const { api } = useMoniteContext();

  return api.paymentIntents.getPaymentIntentsId.useQuery({
    path: {
      payment_intent_id,
    },
  });
};

export const usePaymentIntentByObjectId = (objectId: string) => {
  const { api } = useMoniteContext();

  return api.paymentIntents.getPaymentIntents.useQuery(
    {
      query: {
        object_id: objectId,
        sort: 'created_at',
        order: 'desc',
      },
    },
    {}
  );
};
