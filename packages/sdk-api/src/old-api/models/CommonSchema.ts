/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ActionSchema } from './ActionSchema';

export type CommonSchema = {
  /**
   * List of actions
   */
  actions?: Array<ActionSchema>;
  /**
   * Object type
   */
  object_type?: 'payment_record';
};
