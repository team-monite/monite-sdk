/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TemplateDataSchema } from './TemplateDataSchema';

export type SystemTemplateDataSchema = {
    /**
     * Name of the template
     */
    template_name: string;
    /**
     * Array of templates
     */
    available_templates: Array<TemplateDataSchema>;
};
