/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AddCustomTemplateSchema = {
    /**
     * Lowercase iso code of language
     */
    language_code: string;
    /**
     * Jinja2 compatible string with email subject
     */
    subject_template: string;
    /**
     * Jinja2 compatible string with email body
     */
    body_template: string;
    /**
     * One of pre-defined names of emails. Should be validated with enum
     */
    template_name: string;
};

