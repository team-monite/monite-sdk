/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { entities__unversioned__schemas__file_saver__FileSchema } from './entities__unversioned__schemas__file_saver__FileSchema';
import type { PayableEntityAddressSchema } from './PayableEntityAddressSchema';
import type { PayableOrganizationSchema } from './PayableOrganizationSchema';
import type { StatusEnum } from './StatusEnum';

/**
 * A base for an entity response schema
 */
export type PayableEntityOrganizationResponse = {
  /**
   * UUID entity ID
   */
  id: string;
  /**
   * UTC datetime
   */
  created_at: string;
  /**
   * UTC datetime
   */
  updated_at: string;
  address: PayableEntityAddressSchema;
  /**
   * An official email address of the entity
   */
  email?: string;
  /**
   * A logo image of the entity
   */
  logo?: entities__unversioned__schemas__file_saver__FileSchema;
  /**
   * A set of metadata describing an organization
   */
  organization: PayableOrganizationSchema;
  /**
   * A phone number of the entity
   */
  phone?: string;
  /**
   * record status, 'active' by default
   */
  status: StatusEnum;
  /**
   * An identification number of the legal entity
   */
  tax_id?: string;
  /**
   * A website of the entity
   */
  website?: string;
};
