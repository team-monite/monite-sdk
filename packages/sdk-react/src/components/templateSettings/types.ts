export type DocumentNumberFormValues = {
  credit_note: string;
  credit_note_number: number;
  delivery_note: string;
  delivery_note_number: number;
  invoice: string;
  invoice_number: number;
  purchase_order: string;
  purchase_order_number: number;
  quote: string;
  quote_number: number;
  include_date: boolean;
  min_digits: number;
  prefix: string;
  separator: '/' | '-' | '|' | '.' | '';
};

export type OtherSettingsFormValues = {
  invoice_bank_display: boolean;
  credit_note_bank_display: boolean;
  quote_bank_display: boolean;
  update_paid_invoices: boolean;
  quote_signature_display: boolean;
  quote_electronic_signature: boolean | string;
};

export type ARDocumentType =
  | 'invoice'
  | 'quote'
  | 'credit_note'
  | 'delivery_note';
export type APDocumentType = 'purchase_order';
export type DocumentType = ARDocumentType | APDocumentType;
