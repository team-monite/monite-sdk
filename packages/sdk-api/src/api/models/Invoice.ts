/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceFile } from './InvoiceFile';

export type Invoice = {
    issue_date?: string;
    due_date?: string;
    file?: InvoiceFile;
};

