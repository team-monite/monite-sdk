/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SendEmailSchema = {
    /**
     * The name of email template to send
     */
    template_name: string;
    /**
     * Entity ID
     */
    entity_id: string;
    /**
     * Partner ID
     */
    partner_id: string;
    /**
     * The names of email recipients
     */
    recipients: Array<string>;
    /**
     * ISO 639-1 Language code
     */
    language_code: string;
    /**
     * Payload that corresponds with template_name (pydantic.Model with required parameters)
     */
    template_data?: any;
    /**
     * Dictionary of Mandatory URL and Custom name for attachment
     */
    attachments?: Record<string, string>;
    /**
     * External user ID
     */
    external_user_id?: string;
    sender?: string;
};

