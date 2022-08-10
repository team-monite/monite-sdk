/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema for receiving a request for previewing an email with a receivable document
 */
export type ReceivablePreviewResponse = {
    subject_preview: string;
    body_preview: string;
};

