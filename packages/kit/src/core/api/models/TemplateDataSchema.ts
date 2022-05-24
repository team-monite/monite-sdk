/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TemplateDataSchema = {
    /**
     * Lowercase language code [en, de]
     */
    language: string;
    /**
     * Jinja2 compatible email subject template
     */
    subject_template: string;
    /**
     * Jinja2 compatible email body template
     */
    body_template: string;
};
