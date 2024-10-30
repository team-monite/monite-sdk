/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BizObjectsSchema } from './BizObjectsSchema';

export type RolesCreatePayload = {
  description?: string;
  name: string;
  /**
   * Access permissions
   */
  permissions: BizObjectsSchema;
};
