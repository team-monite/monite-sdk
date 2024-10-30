/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EntityBusinessStructure } from './EntityBusinessStructure';

/**
 * A schema contains metadata for updating an organization
 */
export type OptionalOrganizationSchema = {
  /**
   * Business structure of the company
   */
  business_structure?: EntityBusinessStructure;
  directors_provided?: boolean;
  executives_provided?: boolean;
  /**
   * A code which identifies uniquely a party of a transaction worldwide
   */
  legal_entity_id?: string;
  /**
   * A legal name of an organization
   */
  legal_name?: string;
  owners_provided?: boolean;
  representative_provided?: boolean;
};
