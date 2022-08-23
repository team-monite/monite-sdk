import { PaymentMethodsEnum } from '@monite/js-sdk';

export type URLData = {
  amount: number;
  payment_reference: string;
  currency: string;
  payment_methods: PaymentMethodsEnum[];
  stripe: { secret: { card: string; others: string }; publishable: string };
  success_url: string;
  cancel_url: string;
  payee: {
    name: string;
    account_identification: {
      type: string;
      value: string;
    };
  };
  object: {
    id: string;
    type: string;
  };
  account_id: string;
  id: string;
};
