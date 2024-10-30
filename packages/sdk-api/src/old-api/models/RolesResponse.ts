/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BizObjectsSchema } from './BizObjectsSchema';

export type RolesResponse = {
  id: string;
  created_by_user_id?: string;
  description?: string;
  name: string;
  /**
   * Access permissions
   */
  permissions: BizObjectsSchema;
};
