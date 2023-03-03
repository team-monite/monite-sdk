/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MailboxResponse = {
    /**
     * Mailbox UUID
     */
    id: string;
    status: string;
    related_object_type: string;
    mailbox_name: string;
    mailbox_full_address: string;
    mailbox_domain_id?: string;
};

