import { components } from '@/api';

export type OptionalFields = {
  invoiceDate?: boolean;
  tags?: boolean;
};

export type OcrRequiredField =
  | 'currency'
  | 'invoiceDate'
  | 'counterpart'
  | 'invoiceNumber'
  | 'counterpartBankAccount'
  | 'document_issued_at_date'
  | 'dueDate'
  | 'tags'
  | 'counterpartName'
  | 'contactPerson'
  | 'issueDate'
  | 'amount'
  | 'appliedPolicy'
  | 'addedByUser'
  | 'addedOn'
  | 'updatedOn';

export type OcrRequiredFields =
  | Partial<Record<OcrRequiredField, boolean>>
  | undefined;

export type PaymentRecordWithIntent = {
  intent: string;
  record: components['schemas']['PaymentRecordResponse'];
};
