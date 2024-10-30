/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ObjectType } from './ObjectType';
import type { PayableTemplatesVariable } from './PayableTemplatesVariable';
import type { VariablesType } from './VariablesType';

export type PayableTemplatesVariablesObject = {
  object_subtype: VariablesType;
  object_type: ObjectType;
  variables: Array<PayableTemplatesVariable>;
};
