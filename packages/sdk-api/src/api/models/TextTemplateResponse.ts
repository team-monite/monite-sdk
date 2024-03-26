/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { TextTemplateType } from './TextTemplateType';

export type TextTemplateResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  document_type: DocumentTypeEnum;
  is_default: boolean;
  name: string;
  template: string;
  type: TextTemplateType;
};
