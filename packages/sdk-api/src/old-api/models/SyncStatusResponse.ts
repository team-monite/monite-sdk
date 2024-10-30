/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ObjectMatchTypes } from './ObjectMatchTypes';
import type { SyncStatus } from './SyncStatus';

export type SyncStatusResponse = {
  id?: string;
  sync_status?: SyncStatus;
  type?: ObjectMatchTypes;
};
