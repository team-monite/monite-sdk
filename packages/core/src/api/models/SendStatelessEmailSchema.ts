/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Template } from './Template';

export type SendStatelessEmailSchema = {
    /**
     * The name of sender email
     */
    sender: string;
    /**
     * The names of email recipients
     */
    recipients: Array<string>;
    /**
     * Email subject and body JINJA2 templates
     */
    template: Template;
    /**
     * Payload that corresponds with template_name (pydantic.Model with required parameters)
     */
    template_data?: any;
    /**
     * Dictionary of Mandatory URL and Custom name for attachment
     */
    attachments?: Record<string, string>;
};

