export type Option = { label: string; value: string };

export default interface PayableDetailsFormFields {
  suppliersName: Option;
  invoiceNumber: string;
  invoiceDate: string;
  suggestedPaymentDate: string;
  dueDate: string;
  total: number;
  tags: Option[];
  iban: string;
  bic: string;
}
