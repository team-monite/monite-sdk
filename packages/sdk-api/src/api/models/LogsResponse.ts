/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { LogResponse } from './LogResponse';

export type LogsResponse = {
  data: Array<LogResponse>;
  next_pagination_token?: string;
  prev_pagination_token?: string;
  total_logs: number;
  total_pages: number;
};
