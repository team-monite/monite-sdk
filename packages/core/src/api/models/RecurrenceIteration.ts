/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { IterationStatus } from './IterationStatus';

export type RecurrenceIteration = {
    issue_at: string;
    issued_invoice_id?: string;
    status: IterationStatus;
    iteration?: number;
};

