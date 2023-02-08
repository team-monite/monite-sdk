import {
  CounterpartAddress,
  CounterpartResponse as Counterpart,
  CurrencyEnum,
  PayableResponseSchema,
  PayableUpdateSchema,
  TagReadSchema,
} from '@team-monite/sdk-api';
import { formatFromMinorUnits, formatToMinorUnits } from 'core/utils';
import {
  getIndividualName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from 'components/counterparts/helpers';
import { format } from 'date-fns';

export type Option = { label: string; value: string };

export const counterpartsToSelect = (
  counterparts: Counterpart[] | undefined
): Option[] => {
  if (!counterparts) return [];

  return counterparts?.map((counterpart) => ({
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

export const tagsToSelect = (tags: TagReadSchema[] | undefined): Option[] => {
  if (!tags) return [];

  return tags.map(({ id: value, name: label }) => ({
    value,
    label,
  }));
};

export const dateToString = (date: string): string => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export interface PayableDetailsFormFields {
  counterpart: Option;
  invoiceNumber: string;
  currency: CurrencyEnum;
  invoiceDate: string;
  suggestedPaymentDate: string;
  dueDate: string;
  total: number;
  tags: Option[];
  iban: string;
  bic: string;
}

export interface SubmitPayload extends PayableDetailsFormFields {
  counterpartAddress: CounterpartAddress;
}

export const prepareDefaultValues = ({
  currency,
  counterpart_id,
  counterpart_name,
  document_id,
  issued_at,
  due_date,
  suggested_payment_term,
  amount,
  tags,
  counterpart_bank_id,
  counterpart_account_id,
}: PayableResponseSchema): PayableDetailsFormFields => ({
  currency: currency ?? CurrencyEnum.EUR,
  counterpart:
    counterpart_id && counterpart_name
      ? {
          value: counterpart_id ?? '',
          label: counterpart_name ?? '',
        }
      : {
          value: '',
          label: '',
        },
  invoiceNumber: document_id ?? '',
  invoiceDate: issued_at ?? '',
  suggestedPaymentDate: suggested_payment_term?.date ?? '',
  dueDate: due_date ?? '',
  total: formatFromMinorUnits(amount ?? 0, currency ?? CurrencyEnum.EUR),
  tags: tagsToSelect(tags),
  iban: counterpart_account_id ?? '',
  bic: counterpart_bank_id ?? '',
});

export const prepareSubmit = ({
  currency,
  total,
  dueDate,
  suggestedPaymentDate,
  bic,
  iban,
  invoiceNumber,
  counterpart,
  tags,
  counterpartAddress,
}: SubmitPayload): PayableUpdateSchema => ({
  currency,
  amount: formatToMinorUnits(total, currency),
  due_date: dateToString(dueDate),
  suggested_payment_term: suggestedPaymentDate
    ? {
        date: dateToString(suggestedPaymentDate),
        // discount: 0,
      }
    : undefined,
  counterpart_bank_id: bic,
  counterpart_account_id: iban,
  counterpart_id: counterpart.value,
  counterpart_name: counterpart.label,
  tag_ids: tags.map((tag) => tag.value),
  document_id: invoiceNumber,
  counterpart_address: counterpartAddress,

  // TODO: need to mapping
  // description: '',
  // payment_terms: PaymentTermsCreatePayload,
  // issued_at: '',
  // subtotal: 0,
  // tax: number,
});
