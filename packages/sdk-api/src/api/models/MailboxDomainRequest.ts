/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectTypeEnum } from './ObjectTypeEnum';

export type MailboxDomainRequest = {
    /**
     * Related object type: payable and so on
     */
    related_object_type: ObjectTypeEnum;
    mailbox_full_address: string;
};

