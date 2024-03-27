/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { DocumentExportResponseSchema } from './DocumentExportResponseSchema';

export type AllDocumentExportResponseSchema = {
  /**
   * A set of export objects returned per page.
   */
  data: Array<DocumentExportResponseSchema>;
  /**
   * A token that can be sent in the `pagination_token` query parameter to get the next page of results. If there is no next page, i.e. you have reached the last page, the value is `null`.
   */
  next_pagination_token?: string;
  /**
   * A token that can be sent in the `pagination_token` query parameter to get the previous page of results. If there is no previous page, i.e. you have reached the first page, the value is `null`.
   */
  prev_pagination_token?: string;
};
