import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  ApiError,
  CreatePaymentLinkRequest,
  PublicPaymentLinkResponse,
} from '@monite/sdk-api';
import { useMutation } from '@tanstack/react-query';

export const PAYMENTS_QUERY_ID = 'payment_links';

export const paymentsQueryKeys = {
  paymentLinks: () => [typeof PAYMENTS_QUERY_ID],
};

export const useCreatePaymentLink = () => {
  const { monite } = useMoniteContext();

  return useMutation<
    PublicPaymentLinkResponse,
    ApiError,
    CreatePaymentLinkRequest
  >(paymentsQueryKeys.paymentLinks(), (body) =>
    monite.api.payment.createLink(body)
  );
};
