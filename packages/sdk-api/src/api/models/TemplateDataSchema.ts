/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TemplateDataSchema = {
  /**
   * Jinja2 compatible email body template
   */
  body_template: string;
  /**
   * Lowercase ISO code of language
   */
  language: string;
  /**
   * Jinja2 compatible email subject template
   */
  subject_template: string;
};
