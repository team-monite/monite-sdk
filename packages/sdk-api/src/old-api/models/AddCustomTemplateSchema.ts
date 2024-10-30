/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DocumentObjectTypeRequestEnum } from './DocumentObjectTypeRequestEnum';
import type { LanguageCodeEnum } from './LanguageCodeEnum';

export type AddCustomTemplateSchema = {
  /**
   * Jinja2 compatible string with email body
   */
  body_template: string;
  /**
   * Is default template
   */
  is_default?: boolean;
  /**
   * Lowercase ISO code of language
   */
  language?: LanguageCodeEnum;
  /**
   * Custom template name
   */
  name: string;
  /**
   * Jinja2 compatible string with email subject
   */
  subject_template: string;
  /**
   * Document type of content
   */
  type: DocumentObjectTypeRequestEnum;
};
