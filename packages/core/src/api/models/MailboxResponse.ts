/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MailboxResponse = {
    /**
     * Mailbox UUID
     */
    id: string;
    /**
     * UUID entity ID
     */
    entity_id: string;
    status: string;
    related_object_type: string;
    mailbox_name: string;
    mailbox_full_address: string;
    belongs_to_mailbox_domain_id?: string;
};
