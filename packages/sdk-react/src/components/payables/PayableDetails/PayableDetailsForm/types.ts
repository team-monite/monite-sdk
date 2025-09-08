import { components } from '@/api';

export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  tax: number;
};
export interface PayableDetailsFormFields {
  invoiceNumber: string;
  counterpart: string;
  counterpartBankAccount?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  currency: components['schemas']['CurrencyEnum'];
  tags: components['schemas']['TagReadSchema'][];
  lineItems: LineItem[];
  discount?: number | null;
}
