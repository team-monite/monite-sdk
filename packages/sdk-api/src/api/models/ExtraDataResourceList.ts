/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ExtraDataResource } from './ExtraDataResource';

export type ExtraDataResourceList = {
  data: Array<ExtraDataResource>;
  next_pagination_token?: string;
  prev_pagination_token?: string;
};
