/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * When a PDF document is uploaded to Monite, it extracts individual pages from the document
 * and saves them as PNG images. This object contains the image and metadata of a single page.
 */
export type PageSchema = {
  /**
   * A unique ID of the image.
   */
  id: string;
  /**
   * The [media type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the image.
   */
  mimetype: string;
  /**
   * The page number in the PDF document, from 0.
   */
  number: number;
  /**
   * Image file size, in bytes.
   */
  size: number;
  /**
   * The URL to download the image.
   */
  url: string;
};
