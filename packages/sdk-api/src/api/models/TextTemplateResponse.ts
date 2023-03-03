/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { TextTemplateType } from './TextTemplateType';

export type TextTemplateResponse = {
    name: string;
    document_type: DocumentTypeEnum;
    type: TextTemplateType;
    template: string;
    id: string;
    created_at: string;
    updated_at: string;
    is_default: boolean;
};

