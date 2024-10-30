/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { MailboxObjectTypeEnum } from './MailboxObjectTypeEnum';

export type MailboxDomainRequest = {
  mailbox_domain_id: string;
  mailbox_name: string;
  /**
   * Related object type: payable and so on
   */
  related_object_type: MailboxObjectTypeEnum;
};
