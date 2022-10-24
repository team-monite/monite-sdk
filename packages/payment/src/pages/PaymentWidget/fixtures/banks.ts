import {
  PaymentsPaymentsPaymentsPaymentsBanksResponse,
  PaymentsPaymentsAllowedCountriesCodes,
} from '@team-monite/sdk-api';

export const demoBanks: PaymentsPaymentsPaymentsPaymentsBanksResponse = {
  data: [
    {
      code: 'cumberlandbuildingsociety-sandbox',
      name: 'Cumberland Building Society Sandbox',
      full_name: 'Cumberland Building Society Sandbox',
      country: PaymentsPaymentsAllowedCountriesCodes.GB,
      media: [
        {
          source:
            'https://images.yapily.com/image/33261791-72ef-4bf9-84ae-e10f479afc9f?size=0',
          type: 'logo',
        },
        {
          source:
            'https://images.yapily.com/image/2b197304-e12f-4be7-b0b5-039ae57a9719?size=0',
          type: 'icon',
        },
      ],
      payer_required: false,
    },
    {
      code: 'modelo-sandbox',
      name: 'Modelo Sandbox',
      full_name: 'Modelo Sandbox',
      country: PaymentsPaymentsAllowedCountriesCodes.GB,
      media: [
        {
          source:
            'https://images.yapily.com/image/ca502f24-d6df-4785-b4b8-1034b100af77?size=0',
          type: 'logo',
        },
        {
          source:
            'https://images.yapily.com/image/ce2bfdbf-1ae2-4919-ab7b-e8b3d5e93b36?size=0',
          type: 'icon',
        },
      ],
      payer_required: false,
    },
  ],
};
