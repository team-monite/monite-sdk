/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PayableActionSchema } from './PayableActionSchema';

export type PayableSchema = {
  /**
   * List of actions
   */
  actions?: Array<PayableActionSchema>;
  /**
   * Object type
   */
  object_type?: 'payable';
};
