/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { TextTemplateType } from './TextTemplateType';

export type CreateTextTemplatePayload = {
  document_type: DocumentTypeEnum;
  name: string;
  template: string;
  type: TextTemplateType;
};
