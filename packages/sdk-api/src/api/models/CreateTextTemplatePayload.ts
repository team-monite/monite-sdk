/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { TextTemplateType } from './TextTemplateType';

export type CreateTextTemplatePayload = {
    name: string;
    document_type: DocumentTypeEnum;
    type: TextTemplateType;
    template: string;
};

