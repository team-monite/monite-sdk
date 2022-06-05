/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CustomTemplateDataSchema = {
    /**
     * ID of email template
     */
    id: string;
    /**
     * Name of the template
     */
    template_name: string;
    /**
     * ISO language code
     */
    language_code: string;
    /**
     * Jinja2 compatible email subject template
     */
    subject_template: string;
    /**
     * Jinja2 compatible email body template
     */
    body_template: string;
    /**
     * Template created date and time
     */
    created_at: string;
    /**
     * Template updated date and time
     */
    updated_at: string;
};
