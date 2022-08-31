/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SendReminderEmail = {
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
     * Content ID of subject and body text templates
     */
    content_id: string;
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
};

