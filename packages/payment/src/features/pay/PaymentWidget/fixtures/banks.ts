import { PaymentsPaymentsPaymentsPaymentsBanksResponse } from '@monite/sdk-api';

export const demoBanks: PaymentsPaymentsPaymentsPaymentsBanksResponse = {
  data: [
    {
      code: '1',
      name: 'Targobank',
      full_name: 'Targobank',
      country: 'DE',
      media: [
        {
          source:
            'https://play-lh.googleusercontent.com/h1cNfLkLWKR6JCcggFlLlr2NDS9RdeWvhPmoVNCmsMASbm-wyjXPDc6lVX39KyK6KA=w480-h960-rw',
          type: 'string',
        },
      ],
      payer_required: true,
    },
  ],
};
