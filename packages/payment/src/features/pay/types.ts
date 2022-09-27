export type URLData = {
  id: string;
};

export enum PaymentType {
  PAYABLE = 'payable',
  RECEIVABLE = 'receivable',
}

export enum RecipientType {
  COUNTERPART = 'counterpart',
  ENTITY = 'entity',
}
