import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';

export const usePaymentLinkById = (paymentLinkId?: string) => {
  const { api } = useMoniteContext();

  return api.paymentLinks.getPaymentLinksId.useQuery(
    {
      path: { payment_link_id: paymentLinkId ?? '' },
    },
    { enabled: !!paymentLinkId }
  );
};

export const useCreatePayablePaymentLink = () => {
  const { api } = useMoniteContext();

  const createPaymentLinkMutation =
    api.paymentLinks.postPaymentLinks.useMutation({});

  const createPaymentLink = async (
    payableId: string,
    counterpartId: string,
    paymentMethods: components['schemas']['MoniteAllPaymentMethodsTypes'][],
    expiresInDays: number
  ): Promise<components['schemas']['PublicPaymentLinkResponse']> => {
    return createPaymentLinkMutation.mutateAsync({
      recipient: {
        id: counterpartId,
        type: 'counterpart',
      },
      object: {
        id: payableId,
        type: 'payable',
      },
      payment_methods: paymentMethods,
      expires_at: new Date(
        Date.now() + expiresInDays * 24 * 3600 * 1000 // x days from now
      ).toISOString(),
    });
  };

  return createPaymentLink;
};
