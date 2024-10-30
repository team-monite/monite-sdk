/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { FileSchema } from './FileSchema';
import type { TemplateTypeEnum } from './TemplateTypeEnum';

export type TemplateReceivableResponse = {
  id: string;
  created_at?: string;
  updated_at?: string;
  blocks?: Array<string>;
  document_type: DocumentTypeEnum;
  is_default: boolean;
  language: string;
  name: string;
  preview?: FileSchema;
  template: string;
  template_type?: TemplateTypeEnum;
};
