/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageEnum } from './LanguageEnum';

export type TemplateReceivableResponse = {
    document_type: TemplateReceivableResponse.document_type;
    language: LanguageEnum;
    name: string;
    template_type: TemplateReceivableResponse.template_type;
    template: string;
    preview: string;
    id: string;
    created_at: string;
    updated_at: string;
    blocks: Array<string>;
};

export namespace TemplateReceivableResponse {

    export enum document_type {
        RECEIVABLE = 'receivable',
    }

    export enum template_type {
        BLOCK = 'block',
    }


}

