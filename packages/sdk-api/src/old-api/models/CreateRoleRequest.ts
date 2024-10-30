/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BizObjectsSchema } from './BizObjectsSchema';

export type CreateRoleRequest = {
  /**
   * Role name
   */
  name: string;
  /**
   * Access permissions
   */
  permissions: BizObjectsSchema;
};
