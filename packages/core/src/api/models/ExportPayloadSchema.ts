/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExportFormat } from './ExportFormat';
import type { ExportObjectSchema } from './ExportObjectSchema';

export type ExportPayloadSchema = {
    format: ExportFormat;
    objects: Array<ExportObjectSchema>;
    date_from: string;
    date_to: string;
};
