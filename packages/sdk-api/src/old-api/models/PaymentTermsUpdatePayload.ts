/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PaymentTerm } from './PaymentTerm';
import type { PaymentTermDiscount } from './PaymentTermDiscount';

export type PaymentTermsUpdatePayload = {
  description?: string;
  name?: string;
  term_1?: PaymentTermDiscount;
  term_2?: PaymentTermDiscount;
  term_final?: PaymentTerm;
};
