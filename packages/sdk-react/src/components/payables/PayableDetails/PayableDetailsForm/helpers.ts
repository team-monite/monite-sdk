import { components } from '@/api';
import {
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '@/components/counterparts/helpers';
import {
  OcrRequiredField,
  OcrRequiredFields,
  OptionalFields,
} from '@/components/payables/types';
import { CounterpartResponse } from '@/core/queries';
import { getIndividualName } from '@/core/utils';
import { format } from 'date-fns';
import { FieldValue, FieldValues } from 'react-hook-form';

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
  tags: components['schemas']['TagReadSchema'][];
  lineItems: LineItem[];
  discount?: number | null;
  subtotal?: number | null;
  tax_amount?: number | null;
  total_amount?: number | null;
  useManualTotals?: boolean; // TODO: remove this field once partner setting is implemented
}

export interface SubmitPayload extends PayableDetailsFormFields {
  counterpartAddressId?: string;
}

const DEFAULT_CURRENCY = 'EUR';

export const counterpartsToSelect = (
  counterparts: CounterpartResponse[] | undefined
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
      currency: DEFAULT_CURRENCY,
      tags: [],
      discount: null,
      subtotal: null,
      tax_amount: null,
      total_amount: null,
      lineItems: [
        {
          id: '',
          name: '',
          quantity: 1,
          price: 0,
          tax: 19,
        },
      ],
      useManualTotals: false, // TODO: remove this field once partner setting is implemented
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
    subtotal,
    tax_amount,
    discount,
    total_amount,
  } = payable;

  return {
    invoiceNumber: document_id ?? '',
    counterpart: counterpart_id ?? '',
    counterpartBankAccount: counterpart_bank_account_id ?? '',
    invoiceDate: issued_at ? new Date(issued_at) : undefined,
    dueDate: due_date ? new Date(due_date) : undefined,
    currency: currency ?? DEFAULT_CURRENCY,
    tags: tags ?? [],
    discount:
      discount && currency ? formatFromMinorUnits(discount, currency) : null,
    subtotal:
      subtotal && currency ? formatFromMinorUnits(subtotal, currency) : null,
    tax_amount:
      tax_amount && currency
        ? formatFromMinorUnits(tax_amount, currency)
        : null,
    total_amount:
      total_amount && currency
        ? formatFromMinorUnits(total_amount, currency)
        : null,
    lineItems: (lineItems || []).map((lineItem) => {
      return {
        id: lineItem.id ?? '',
        name: lineItem.name ?? '',
        quantity: lineItem.quantity ?? 1,
        price:
          lineItem.unit_price && currency
            ? (formatFromMinorUnits(lineItem.unit_price, currency) ?? 0)
            : 0,
        tax: lineItem.tax ? formatTaxFromMinorUnits(lineItem.tax) : 0,
      };
    }),
    useManualTotals: false, // TODO: remove this field once partner setting is implemented
  };
};

export const prepareSubmit = (
  {
    invoiceNumber,
    counterpart,
    counterpartBankAccount,
    invoiceDate,
    dueDate,
    currency,
    tags,
    counterpartAddressId,
    subtotal,
    tax_amount,
    discount,
    total_amount,
  }: SubmitPayload,
  formatToMinorUnits: (amount: number, currency: string) => number | null
): components['schemas']['PayableUpdateSchema'] => ({
  document_id: invoiceNumber,
  counterpart_id: counterpart || undefined,
  counterpart_bank_account_id: counterpartBankAccount || undefined,
  issued_at:
    invoiceDate instanceof Date ? dateToString(invoiceDate) : undefined,
  due_date: dueDate instanceof Date ? dateToString(dueDate) : undefined,
  currency,
  tag_ids: tags.map((tag) => tag.id),
  counterpart_address_id: counterpartAddressId,
  subtotal:
    subtotal && currency ? (formatToMinorUnits(subtotal, currency) ?? 0) : 0,
  tax_amount:
    tax_amount && currency
      ? (formatToMinorUnits(tax_amount, currency) ?? 0)
      : 0,
  discount:
    discount && currency ? (formatToMinorUnits(discount, currency) ?? 0) : 0,
  total_amount:
    total_amount && currency
      ? (formatToMinorUnits(total_amount, currency) ?? 0)
      : 0,
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
  currentLineItems: LineItem[],
  discount?: number | null
): { subtotal: number; taxes: number; total: number } => {
  const { subtotal, taxes, total } = currentLineItems.reduce(
    (result, lineItem) => {
      const newSubtotal = calculateLineItemSubtotal(
        lineItem.price,
        lineItem.quantity
      );
      const newTotal = calculateLineItemTotal(newSubtotal, lineItem.tax || 0);

      return {
        subtotal: parseFloat((result.subtotal + newSubtotal).toFixed(2)),
        taxes: parseFloat((result.taxes + (newTotal - newSubtotal)).toFixed(2)),
        total: parseFloat((result.total + newTotal).toFixed(2)),
      };
    },
    { subtotal: 0, taxes: 0, total: 0 }
  );

  return {
    subtotal,
    taxes,
    total: parseFloat((total - (discount ?? 0)).toFixed(2)),
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

export const isFieldRequired = <TFieldValues extends FieldValues>(
  fieldName: OcrRequiredField,
  ocrRequiredFields: OcrRequiredFields,
  value?: FieldValue<TFieldValues>
) => {
  const defaultRequiredFields: Record<string, boolean> = {
    invoiceNumber: true,
    dueDate: true,
    tags: true,
    currency: true,
  };

  if (value) {
    return false;
  }

  const isDefaultRequired = defaultRequiredFields[fieldName] ?? false;
  const isOcrRequired = ocrRequiredFields?.[fieldName] ?? false;

  return isDefaultRequired || isOcrRequired;
};

export const isOcrMismatch = (
  payableData: components['schemas']['PayableResponseSchema']
) => {
  const { amount_to_pay, counterpart_bank_account_id, other_extracted_data } =
    payableData;

  if (!other_extracted_data || !('total' in other_extracted_data)) {
    return {
      isAmountMismatch: false,
      isBankAccountMismatch: false,
    };
  }

  const { total: ocrTotal } = other_extracted_data;
  const ocrBankAccountId =
    'counterpart_account_id' in other_extracted_data
      ? other_extracted_data.counterpart_account_id
      : undefined;

  const isAmountMismatch = amount_to_pay !== ocrTotal;

  const isBankAccountMismatch =
    counterpart_bank_account_id && ocrBankAccountId
      ? counterpart_bank_account_id !== ocrBankAccountId
      : false;

  return {
    isAmountMismatch,
    isBankAccountMismatch,
  };
};

export type OcrMismatchField = keyof Pick<
  components['schemas']['PayableResponseSchema'],
  'amount_to_pay' | 'counterpart_bank_account_id'
>;

export type OcrMismatchFields =
  | Partial<Record<OcrMismatchField, boolean>>
  | undefined;

export interface MonitePayableDetailsInfoProps {
  optionalFields?: OptionalFields;
  ocrRequiredFields?: OcrRequiredFields;
  ocrMismatchFields?: OcrMismatchFields;
  isTagsDisabled?: boolean;
}

export const findDefaultBankAccount = (
  accounts: components['schemas']['CounterpartBankAccountResponse'][],
  currentCurrency: components['schemas']['CurrencyEnum']
): string => {
  const defaultAccount = accounts.find(
    (acc) => acc.currency === currentCurrency && acc.is_default_for_currency
  );
  return defaultAccount?.id || '';
};
