/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { SyncStatusResponse } from './SyncStatusResponse';

export type SyncStatusResponseList = {
  data: Array<SyncStatusResponse>;
  next_pagination_token?: string;
  prev_pagination_token?: string;
};
