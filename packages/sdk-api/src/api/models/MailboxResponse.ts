/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MailboxResponse = {
  /**
   * Mailbox UUID
   */
  id: string;
  mailbox_domain_id?: string;
  mailbox_full_address: string;
  mailbox_name: string;
  related_object_type: string;
  status: string;
};
