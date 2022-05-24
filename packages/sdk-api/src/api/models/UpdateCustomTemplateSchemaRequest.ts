/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { LanguageCodeEnum } from './LanguageCodeEnum';

export type UpdateCustomTemplateSchemaRequest = {
  /**
   * Jinja2 compatible string with email body
   */
  body_template?: string;
  /**
   * Lowercase ISO code of language
   */
  language?: LanguageCodeEnum;
  /**
   * Custom template name
   */
  name?: string;
  /**
   * Jinja2 compatible string with email subject
   */
  subject_template?: string;
};
