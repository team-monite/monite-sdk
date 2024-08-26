export enum PayableDataTestId {
  PayableDetailsActions = 'PayableDetailsActions',
}

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
