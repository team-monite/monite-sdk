/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { InvoiceStateEnumForAccountingSyncRules } from './InvoiceStateEnumForAccountingSyncRules';
import type { PayableStateEnum } from './PayableStateEnum';

export type DocumentTypeVariants = {
  payable?: Array<PayableStateEnum>;
  receivable?: Array<InvoiceStateEnumForAccountingSyncRules>;
};
