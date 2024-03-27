/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema for receiving a request for previewing an email with a receivable document
 */
export type ReceivablePreviewRequest = {
  /**
   * Body text of the content
   */
  body_text: string;
  /**
   * Language code for localization purposes
   */
  language?: string;
  /**
   * Subject text of the content
   */
  subject_text: string;
};
