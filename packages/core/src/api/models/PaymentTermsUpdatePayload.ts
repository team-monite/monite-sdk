/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentTerm } from './PaymentTerm';
import type { PaymentTermDiscount } from './PaymentTermDiscount';

export type PaymentTermsUpdatePayload = {
    name?: string;
    description?: string;
    term_final?: PaymentTerm;
    term_1?: PaymentTermDiscount;
    term_2?: PaymentTermDiscount;
};
