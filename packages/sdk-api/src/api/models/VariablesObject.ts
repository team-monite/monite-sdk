/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentTypeEnum } from './DocumentTypeEnum';
import type { Variable } from './Variable';

export type VariablesObject = {
    object_type: string;
    object_subtype: DocumentTypeEnum;
    variables: Array<Variable>;
};

