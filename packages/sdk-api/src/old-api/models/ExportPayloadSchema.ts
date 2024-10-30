/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ExportFormat } from './ExportFormat';
import type { ExportObjectSchema } from './ExportObjectSchema';

export type ExportPayloadSchema = {
  date_from: string;
  date_to: string;
  format: ExportFormat;
  objects: Array<ExportObjectSchema>;
};
