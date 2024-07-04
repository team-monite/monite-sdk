import { components } from '@/api';
import {
  getIndividualName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import {
  CounterpartBankAccountResponse,
  CounterpartResponse as Counterpart,
} from '@monite/sdk-api';

import { format } from 'date-fns';

export type Option = { label: string; value: string };

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
  tags: Option[];
  lineItems: LineItem[];
}

export interface SubmitPayload extends PayableDetailsFormFields {
  counterpartAddressId?: string;
}

export const counterpartsToSelect = (
  counterparts: Counterpart[] | undefined
): Option[] => {
  if (!counterparts) return [];

  return counterparts.map((counterpart) => ({
    value: counterpart.id,
    label: isIndividualCounterpart(counterpart)
      ? getIndividualName(
          counterpart.individual.first_name,
          counterpart.individual.last_name
        )
      : isOrganizationCounterpart(counterpart)
      ? counterpart.organization.legal_name
      : '',
  }));
};

export const counterpartBankAccountsToSelect = (
  bankAccounts: CounterpartBankAccountResponse[]
): Option[] => {
  return bankAccounts.map((bankAccount) => ({
    value: bankAccount.id,
    label: bankAccount.name ?? bankAccount.id,
  }));
};

export const tagsToSelect = (
  tags: components['schemas']['TagReadSchema'][] | undefined
): Option[] => {
  if (!tags) return [];

  return tags.map(({ id: value, name: label }) => ({
    value,
    label,
  }));
};

/** Prepare date to be sent to the Monite API with the correct format (yyyy-MM-dd)
 *
 * @see {@link https://docs.monite.com/reference/patch_payables_id} for additional information.
 * @param {date} date - Date to be formatted
 * @returns {string} - Formatted date
 * */
export const dateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const prepareDefaultValues = (
  formatFromMinorUnits: (
    amount: number,
    currency: components['schemas']['CurrencyEnum'] | string
  ) => number | null,
  payable?: components['schemas']['PayableResponseSchema'],
  lineItems?: components['schemas']['LineItemResponse'][]
): PayableDetailsFormFields => {
  if (!payable) {
    return {
      invoiceNumber: '',
      counterpart: '',
      counterpartBankAccount: '',
      invoiceDate: undefined,
      dueDate: undefined,
      currency: 'EUR',
      tags: [],
      lineItems: [
        {
          id: '',
          name: '',
          quantity: 1,
          price: 0,
          tax: 19,
        },
      ],
    };
  }

  const {
    document_id,
    counterpart_id,
    counterpart_bank_account_id,
    issued_at,
    due_date,
    currency,
    tags,
  } = payable;

  return {
    invoiceNumber: document_id ?? '',
    counterpart: counterpart_id ?? '',
    counterpartBankAccount: counterpart_bank_account_id ?? '',
    invoiceDate: issued_at ? new Date(issued_at) : undefined,
    dueDate: due_date ? new Date(due_date) : undefined,
    currency: currency ?? 'EUR',
    tags: tagsToSelect(tags),
    lineItems: (lineItems || []).map((lineItem) => {
      return {
        id: lineItem.id ?? '',
        name: lineItem.name ?? '',
        quantity: lineItem.quantity ?? 1,
        price:
          lineItem.unit_price && currency
            ? formatFromMinorUnits(lineItem.unit_price, currency) ?? 0
            : 0,
        tax: lineItem.tax ? formatTaxFromMinorUnits(lineItem.tax) : 0,
      };
    }),
  };
};

export const prepareSubmit = ({
  invoiceNumber,
  counterpart,
  counterpartBankAccount,
  invoiceDate,
  dueDate,
  currency,
  tags,
  counterpartAddressId,
}: SubmitPayload): components['schemas']['PayableUpdateSchema'] => ({
  document_id: invoiceNumber,
  counterpart_id: counterpart || undefined,
  counterpart_bank_account_id: counterpartBankAccount || undefined,
  issued_at:
    invoiceDate instanceof Date ? dateToString(invoiceDate) : undefined,
  due_date: dueDate instanceof Date ? dateToString(dueDate) : undefined,
  currency,
  tag_ids: tags.map((tag) => tag.value),
  counterpart_address_id: counterpartAddressId,
});

const calculateLineItemSubtotal = (price: number, quantity: number): number => {
  const subtotal = price * quantity;

  return parseFloat(subtotal.toFixed(2));
};

const calculateLineItemTotal = (subtotal: number, taxRate: number): number => {
  const total = subtotal + (taxRate * subtotal) / 100;

  return parseFloat(total.toFixed(2));
};

export const calculateTotalPriceForLineItem = (lineItem: LineItem): number => {
  const { price, quantity, tax } = lineItem;

  if (!price || !quantity) return 0;

  const subtotal = calculateLineItemSubtotal(price, quantity);
  return calculateLineItemTotal(subtotal, tax || 0);
};

export const calculateTotalsForPayable = (
  currentLineItems: LineItem[]
): { subtotal: number; taxes: number; total: number } => {
  const { subtotal, taxes, total } = currentLineItems.reduce(
    (result, lineItem) => {
      const newSubtotal = calculateLineItemSubtotal(
        lineItem.price,
        lineItem.quantity
      );
      const newTotal = calculateLineItemTotal(newSubtotal, lineItem.tax || 0);

      return {
        subtotal: result.subtotal + newSubtotal,
        taxes: result.taxes + (newTotal - newSubtotal),
        total: result.total + newTotal,
      };
    },
    { subtotal: 0, taxes: 0, total: 0 }
  );

  return {
    subtotal,
    taxes,
    total,
  };
};

export const prepareLineItemSubmit = (
  currency: components['schemas']['CurrencyEnum'],
  lineItem: LineItem,
  formatToMinorUnits: (amount: number, currency: string) => number | null
): components['schemas']['LineItemRequest'] => {
  const { name, quantity, price, tax } = lineItem;

  return {
    name,
    quantity,
    tax: formatTaxToMinorUnits(tax),
    unit_price: formatToMinorUnits(price, currency) ?? 0,
  };
};

function formatTaxToMinorUnits(tax: number): number {
  return tax * 100;
}

function formatTaxFromMinorUnits(tax: number): number {
  return tax / 100;
}
