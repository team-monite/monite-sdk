import { components } from '@/api';

export const paymentIntent: components['schemas']['PaymentIntentWithSecrets'] =
  {
    updated_at: '2023-02-09T10:00:00.000Z',
    confirm_on_backend: false,
    payer: {
      id: 'deaef523-cfd7-48ce-9de9-6d280dca1d6c',
      type: 'entity',
      bank_accounts: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          iban: 'string',
          bic: 'string',
          name: 'string',
          is_default: false,
        },
      ],
    },
    recipient: {
      id: 'deaef523-cfd7-48ce-9de9-6d280dca1d6c',
      type: 'entity',
      bank_accounts: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          iban: 'string',
          bic: 'string',
          name: 'string',
          is_default: false,
        },
      ],
      name: 'string',
    },
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'string',
    amount: 1500,
    payment_methods: ['sepa_credit'],
    selected_payment_method: 'sepa_credit',
    payment_link_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    currency: 'EUR',
    payment_reference: 'string',
    provider: 'string',
    application_fee_amount: 0,
    invoice: {
      issue_date: '2023-02-09',
      due_date: '2023-02-09',
      file: {
        name: 'Invoice',
        mimetype: 'application/pdf',
        url: 'https://monite-file-saver-payables-eu-central-1-dev.s3.amazonaws.com/124c26f2-0430-4bf3-87a1-5ff2b879c480/feafa6df-b5fb-4b26-936f-f3e51ae50995.pdf',
      },
    },
  };
