/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageEnum } from './LanguageEnum';

export type ReceivableTemplateCreatePayload = {
    document_type: ReceivableTemplateCreatePayload.document_type;
    language: LanguageEnum;
    name: string;
    template_type: ReceivableTemplateCreatePayload.template_type;
    template: string;
};

export namespace ReceivableTemplateCreatePayload {

    export enum document_type {
        RECEIVABLE = 'receivable',
    }

    export enum template_type {
        BLOCK = 'block',
    }


}

