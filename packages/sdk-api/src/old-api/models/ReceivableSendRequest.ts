/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema for receiving a request for sending a receivable
 */
export type ReceivableSendRequest = {
  /**
   * Body text of the content
   */
  body_text: string;
  /**
   * Lowercase ISO code of language
   */
  language?: string;
  /**
   * Subject text of the content
   */
  subject_text: string;
};
