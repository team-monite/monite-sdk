/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */

import type { entities__unversioned__schemas__file_saver__PageSchema } from './entities__unversioned__schemas__file_saver__PageSchema';
import type { entities__unversioned__schemas__file_saver__PreviewSchema } from './entities__unversioned__schemas__file_saver__PreviewSchema';

/**
 * Represents a file (such as a PDF invoice) that was uploaded to Monite.
 */
export type entities__unversioned__schemas__file_saver__FileSchema = {
  /**
   * A unique ID of this file.
   */
  id: string;
  /**
   * UTC date and time when this workflow was uploaded to Monite. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
   */
  created_at: string;
  /**
   * The type of the business object associated with this file.
   */
  file_type: string;
  /**
   * The MD5 hash of the file.
   */
  md5: string;
  /**
   * The file's [media type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).
   */
  mimetype: string;
  /**
   * The original file name (if available).
   */
  name: string;
  /**
   * If the file is a PDF document, this property contains individual pages extracted from the file. Otherwise, an empty array.
   */
  pages?: Array<entities__unversioned__schemas__file_saver__PageSchema>;
  /**
   * Preview images generated for this file. There can be multiple images with different sizes.
   */
  previews?: Array<entities__unversioned__schemas__file_saver__PreviewSchema>;
  /**
   * Geographical region of the data center where the file is stored.
   */
  region: string;
  /**
   * The file size in bytes.
   */
  size: number;
  /**
   * The URL to download the file.
   */
  url: string;
};
