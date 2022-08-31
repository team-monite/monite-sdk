/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { LanguageEnum } from './LanguageEnum';
import type { TemplateTypeEnum } from './TemplateTypeEnum';

export type TemplateBaseResponse = {
    document_type: DocumentTypeEnum;
    language: LanguageEnum;
    name: string;
    template_type: TemplateTypeEnum;
    template: string;
    preview: string;
    id: string;
    created_at: string;
    updated_at: string;
    blocks?: Array<string>;
};

