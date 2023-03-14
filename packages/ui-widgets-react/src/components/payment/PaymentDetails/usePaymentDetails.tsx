import { PaymentIntentWithSecrets } from '@team-monite/sdk-api';

import useCurrencies from 'core/hooks/useCurrencies';

export type UsePayableDetailsProps = {
  paymentIntent: PaymentIntentWithSecrets;
};

export default function usePaymentDetails({
  paymentIntent: { currency, amount, payment_reference, invoice, recipient },
}: UsePayableDetailsProps) {
  const { formatCurrencyToDisplay } = useCurrencies();

  return {
    recipient: recipient?.name,
    paymentReference: payment_reference,
    amount: formatCurrencyToDisplay(amount, currency),
    invoice,
  };
}
