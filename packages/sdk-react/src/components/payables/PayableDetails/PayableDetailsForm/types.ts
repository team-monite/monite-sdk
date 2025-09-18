import { components } from '@/api';

export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  tax: number;
  ledger_account_id?: string | null;
};

type PayableTag = { id: string; name: string } & Record<string, unknown>;

export interface PayableDetailsFormFields {
  invoiceNumber: string;
  counterpart: string;
  counterpartBankAccount?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  currency?: components['schemas']['CurrencyEnum'];
  tags: PayableTag[];
  lineItems: LineItem[];
  discount?: number | null;
}
