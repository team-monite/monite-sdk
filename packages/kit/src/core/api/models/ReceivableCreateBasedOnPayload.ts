/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReceivableCreateBasedOnPayload = {
    /**
     * Time by which the invoice must be paid. Timestamps follow the ISO 8601 standard.
     */
    due_date?: string;
    /**
     * The unique ID of a previous document related to the receivable if applicable.
     */
    based_on: string;
};
