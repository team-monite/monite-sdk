/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema for receiving a request for previewing an email with a receivable document
 */
export type ReceivablePreviewRequest = {
    subject_text: string;
    body_text: string;
};
