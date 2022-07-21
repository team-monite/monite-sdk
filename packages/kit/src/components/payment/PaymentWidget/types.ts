import { CurrencyEnum } from '@monite/js-sdk';

export type PaymentWidgetProps = {
  id: string;
  fee?: number;
  currency?: CurrencyEnum;
  onFinish?: (result: any) => void;
  returnUrl?: string;
  stripeEnabled?: boolean;
};

export type BankItem = {
  name: string;
};
