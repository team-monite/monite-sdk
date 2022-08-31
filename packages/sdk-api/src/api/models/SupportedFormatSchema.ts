/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExportFormat } from './ExportFormat';

export type SupportedFormatSchema = {
    object_type: SupportedFormatSchema.object_type;
    available_types: Record<string, Array<ExportFormat>>;
};

export namespace SupportedFormatSchema {

    export enum object_type {
        PAYABLE = 'payable',
        RECEIVABLE = 'receivable',
    }


}

