/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { TemplateDataSchema } from './TemplateDataSchema';

export type SystemTemplateDataSchema = {
  /**
   * Array of templates
   */
  available_templates: Array<TemplateDataSchema>;
  /**
   * Name of the template
   */
  template_name: string;
};
