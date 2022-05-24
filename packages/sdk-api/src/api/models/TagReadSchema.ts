/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Represents a user-defined tag that can be assigned to payables to filter them.
 */
export type TagReadSchema = {
  /**
   * A unique ID of this tag.
   */
  id: string;
  /**
   * Date and time when the tag was created. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
   */
  created_at: string;
  /**
   * Date and time when the tag was last updated. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard.
   */
  updated_at: string;
  /**
   * ID of the user who created the tag
   */
  created_by_entity_user_id?: string;
  /**
   * The tag name.
   */
  name: string;
};
