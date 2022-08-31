/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PayableStateEnum } from './PayableStateEnum';

export type ExportPayableSchema = {
    name: ExportPayableSchema.name;
    statuses: Array<PayableStateEnum>;
};

export namespace ExportPayableSchema {

    export enum name {
        PAYABLE = 'payable',
    }


}

