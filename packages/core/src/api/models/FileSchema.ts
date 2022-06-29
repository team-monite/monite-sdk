/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PageSchema } from './PageSchema';
import type { PreviewSchema } from './PreviewSchema';

/**
 * Represents a file (such as a PDF invoice) that was uploaded to Monite.
 */
export type FileSchema = {
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
     * The original file name (if available).
     */
    name: string;
    /**
     * Geographical region of the data center where the file is stored.
     */
    region: string;
    /**
     * The MD5 hash of the file.
     */
    md5: string;
    /**
     * The file's [media type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).
     */
    mimetype: string;
    /**
     * The URL to download the file.
     */
    url: string;
    /**
     * The file size in bytes.
     */
    size: number;
    /**
     * Preview images generated for this file. There can be multiple images with different sizes.
     */
    previews?: Array<PreviewSchema>;
    pages?: Array<PageSchema>;
};
