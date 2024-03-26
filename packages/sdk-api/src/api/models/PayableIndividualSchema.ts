/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A schema contains metadata for an individual
 */
export type PayableIndividualSchema = {
  date_of_birth?: string;
  /**
   * A first name of an individual
   */
  first_name: string;
  id_number?: string;
  /**
   * A last name of an individual
   */
  last_name: string;
  ssn_last_4?: string;
  /**
   * A title of an individual
   */
  title?: string;
};
