/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesPaymentTerm } from './ReceivablesPaymentTerm';
import type { ReceivablesPaymentTermReceivablesDiscount } from './ReceivablesPaymentTermReceivablesDiscount';

export type ReceivablesReceivablesReceivablesPaymentTermsResponse = {
    name: string;
    description?: string;
    term_final: ReceivablesPaymentTerm;
    term_1?: ReceivablesPaymentTermReceivablesDiscount;
    term_2?: ReceivablesPaymentTermReceivablesDiscount;
    id: string;
};

