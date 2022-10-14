import { Box } from '@team-monite/ui-kit-react';
import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';

import PaymentDetails from './PaymentDetails';

const Story = {
  title: 'Payments/Payment — Details',
  component: PaymentDetails,
};

export default Story;

const payment = {
  id: '43b17c43-e62d-43e0-a27a-f23e6304a2e8',
  currency: 'EUR',
  status: 'created',
  recipient: { id: '9ed91192-457a-4c14-bcf0-71842fbd6e4a', type: 'entity' },
  payment_reference: 'string',
  amount: 1500,
  payment_intents: [
    {
      id: '3bdf47d2-9fa8-43a0-b82e-853a0f5ba334',
      was_used_for_payment: false,
      application_fee_amount: null,
      payment_method: 'ideal',
      key: {
        publishable:
          'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE',
        secret: 'pi_3LsQSxCq0HpJYRYN1NQpLYj3_secret_TBR39RGN04XrFBktegllHBx7I',
      },
      provider: 'stripe',
    },
    {
      id: '1ac5d260-2a96-467c-a619-644c1bae6449',
      was_used_for_payment: false,
      application_fee_amount: null,
      payment_method: 'card',
      key: {
        publishable:
          'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE',
        secret: 'pi_3LsQSyCq0HpJYRYN1r3TSWY9_secret_r1JMfBxm7ONKSYPOe7huAl7cF',
      },
      provider: 'stripe',
    },
  ],
  payment_methods: ['ideal', 'card'],
  total: null,
  return_url: 'https://pay.dev.monite.com/result',
  invoice: {
    issue_date: '2022-10-13',
    due_date: '2022-10-13',
    file_url:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
} as PaymentsPaymentLinkResponse;

export const Default = () => (
  <Box sx={{ width: 635 }}>
    <PaymentDetails payment={payment} />
  </Box>
);
