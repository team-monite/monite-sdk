/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { InvoiceFile } from './InvoiceFile';

export type Invoice = {
  due_date?: string;
  file?: InvoiceFile;
  issue_date?: string;
};
