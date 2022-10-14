import { Box } from '@team-monite/ui-kit-react';
import { PaymentsPaymentLinkResponse } from '@team-monite/sdk-api';

import PaymentDetails from './PaymentDetails';

const Story = {
  title: 'Payments/Payment — Details',
  component: PaymentDetails,
};

export default Story;

const payment = {
  id: '0853d55f-aee4-4fe5-8b07-bbf8402b98f5',
  currency: 'EUR',
  status: 'created',
  recipient: { id: '9ed91192-457a-4c14-bcf0-71842fbd6e4a', type: 'entity' },
  payment_reference: 'string',
  amount: 1500,
  payment_intents: [
    {
      id: '774e19e9-9798-40e9-a554-a866afc62f3a',
      was_used_for_payment: false,
      application_fee_amount: null,
      payment_method: 'ideal',
      key: {
        publishable:
          'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE',
        secret: 'pi_3LsmVLCq0HpJYRYN0m56SyNC_secret_gshOdqMB1P6zMltAZEfjEpaJL',
      },
      provider: 'stripe',
    },
    {
      id: 'efde1faf-2b98-432f-8ae0-701c69e5970e',
      was_used_for_payment: false,
      application_fee_amount: null,
      payment_method: 'card',
      key: {
        publishable:
          'pk_test_51IJivRCq0HpJYRYNxdxMiSromL6P4QicTwwdfYKICAXXTNzkVVkBzF308zNVoYXHw53TPb7aGBptDupflQjxzmGW00jBrBoehE',
        secret: 'pi_3LsmVLCq0HpJYRYN1Oy63wjC_secret_5wQZLMdTPSUdQA8bdCg2gIiQZ',
      },
      provider: 'stripe',
    },
  ],
  payment_methods: ['ideal', 'card'],
  total: null,
  return_url: 'https://pay.dev.monite.com/result',
  invoice: {
    issue_date: '2022-10-14',
    due_date: '2022-10-14',
    file: {
      name: 'test',
      mimetype: 'application/pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
} as PaymentsPaymentLinkResponse;

export const Default = () => (
  <Box sx={{ width: 635 }}>
    <PaymentDetails payment={payment} />
  </Box>
);
