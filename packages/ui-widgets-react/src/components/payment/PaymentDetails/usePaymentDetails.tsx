import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';
import { getReadableAmount } from 'core/utils';

export type UsePayableDetailsProps = {
  payment: PaymentsPaymentLinkResponse;
};

export default function usePaymentDetails({
  payment: { currency, amount, payment_reference, invoice },
}: UsePayableDetailsProps) {
  return {
    recipient: invoice?.name,
    paymentReference: payment_reference,
    amount: getReadableAmount(amount, currency),
    invoice,
  };
}
