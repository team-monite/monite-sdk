export interface PaymentTermsDiscountFields {
  number_of_days: number | null;
  discount: number | null;
}

export interface PaymentTermsFields {
  name: string;
  description?: string;
  term_final: {
    number_of_days: number;
  };
  term_1?: PaymentTermsDiscountFields | null;
  term_2?: PaymentTermsDiscountFields | null;
}

export enum TermField {
  Term1 = 'term_1',
  Term2 = 'term_2',
}
