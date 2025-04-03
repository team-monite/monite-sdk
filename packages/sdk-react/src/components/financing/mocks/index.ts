import { components } from '@/api';

export const OFFERS_MOCK: components['schemas']['FinancingOffer'][] = [
  {
    status: 'CURRENT',
    total_amount: 10000000,
    available_amount: 10000000,
    currency: 'USD',
    pricing_plans: [
      {
        advance_rate_percentage: 10000,
        fee_percentage: 200,
        repayment_type: 'FIXED_DURATION',
        repayment_duration_days: 30,
      },
      {
        advance_rate_percentage: 10000,
        fee_percentage: 300,
        repayment_type: 'FIXED_DURATION',
        repayment_duration_days: 60,
      },
    ],
  },
];
