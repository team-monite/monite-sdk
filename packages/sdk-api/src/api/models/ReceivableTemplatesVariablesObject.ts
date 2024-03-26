/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ReceivableTemplatesVariable } from './ReceivableTemplatesVariable';
import type { VariablesType } from './VariablesType';

export type ReceivableTemplatesVariablesObject = {
  object_subtype: VariablesType;
  object_type: string;
  variables: Array<ReceivableTemplatesVariable>;
};
