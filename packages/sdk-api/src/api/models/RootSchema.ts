/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommonSchema } from './CommonSchema';
import type { PayableSchema } from './PayableSchema';

export type RootSchema = (CommonSchema | PayableSchema);

