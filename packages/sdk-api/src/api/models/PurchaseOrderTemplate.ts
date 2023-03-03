/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PurchaseOrderResponseSchema } from './PurchaseOrderResponseSchema';

export type PurchaseOrderTemplate = {
    template_id: string;
    language: string;
    type: PurchaseOrderTemplate.type;
    params: PurchaseOrderResponseSchema;
};

export namespace PurchaseOrderTemplate {

    export enum type {
        PURCHASE_ORDER = 'purchase_order',
    }


}

