/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CustomTemplateDataSchema = {
  /**
   * ID of email template
   */
  id: string;
  /**
   * Template created date and time
   */
  created_at: string;
  /**
   * Template updated date and time
   */
  updated_at: string;
  /**
   * Jinja2 compatible email body template
   */
  body_template: string;
  /**
   * Is default template
   */
  is_default: boolean;
  /**
   * Lowercase ISO code of language
   */
  language: string;
  /**
   * Name of the template
   */
  name: string;
  /**
   * Jinja2 compatible email subject template
   */
  subject_template: string;
  /**
   * Document type of content
   */
  type: string;
};
