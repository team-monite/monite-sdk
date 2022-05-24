/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OCRResponsePaymentTerm } from './OCRResponsePaymentTerm';
import type { OCRResponsePaymentTermDiscount } from './OCRResponsePaymentTermDiscount';

export type OCRResponsePaymentTermsPayload = {
  name: string;
  description?: string;
  term_final: OCRResponsePaymentTerm;
  term_1?: OCRResponsePaymentTermDiscount;
  term_2?: OCRResponsePaymentTermDiscount;
};
