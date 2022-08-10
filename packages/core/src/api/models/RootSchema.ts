/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommonSchema } from './CommonSchema';
import type { PayableSchema } from './PayableSchema';

/**
 * An abstract which provides interfaces for managing polymorphic schemas
 */
export type RootSchema = (CommonSchema | PayableSchema);

