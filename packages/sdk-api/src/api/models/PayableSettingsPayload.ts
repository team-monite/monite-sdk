/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PayableSettingsPayload = {
  allow_cancel_duplicates_automatically?: boolean;
  allow_counterpart_autocreation?: boolean;
  allow_counterpart_autolinking?: boolean;
  approve_page_url: string;
  /**
   * A state each new payable will have upon creation
   */
  default_state?: string;
  enable_line_items?: boolean;
};
