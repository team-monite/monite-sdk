/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MailboxObjectTypeEnum } from './MailboxObjectTypeEnum';

export type MailboxDomainRequest = {
    /**
     * Related object type: payable and so on
     */
    related_object_type: MailboxObjectTypeEnum;
    mailbox_name: string;
    mailbox_domain_id: string;
};

