/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivableResponse } from './ReceivableResponse';

export type ReceivableTemplate = {
    template_id: string;
    language: string;
    type: ReceivableTemplate.type;
    params: ReceivableResponse;
    regulatory_settings_id?: string;
};

export namespace ReceivableTemplate {

    export enum type {
        RECEIVABLE = 'receivable',
    }


}

