/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesPaymentTermReceivablesDiscountWithDate } from './ReceivablesPaymentTermReceivablesDiscountWithDate';
import type { ReceivablesTermFinalWithDate } from './ReceivablesTermFinalWithDate';

export type ReceivablesReceivablesPaymentTerms = {
    id: string;
    name?: string;
    term_final: ReceivablesTermFinalWithDate;
    term_1?: ReceivablesPaymentTermReceivablesDiscountWithDate;
    term_2?: ReceivablesPaymentTermReceivablesDiscountWithDate;
};

