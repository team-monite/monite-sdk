/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { Variable } from './Variable';

export type VariablesObject = {
  object_subtype: DocumentTypeEnum;
  object_type: string;
  variables: Array<Variable>;
};
