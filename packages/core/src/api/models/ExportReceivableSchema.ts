/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesStatusEnum } from './ReceivablesStatusEnum';

export type ExportReceivableSchema = {
    name: ExportReceivableSchema.name;
    statuses: Array<ReceivablesStatusEnum>;
};

export namespace ExportReceivableSchema {

    export enum name {
        RECEIVABLE = 'receivable',
    }


}

