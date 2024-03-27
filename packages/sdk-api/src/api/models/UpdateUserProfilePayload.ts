/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { UpdatePasswordPayload } from './UpdatePasswordPayload';

export type UpdateUserProfilePayload = {
  fullname?: string;
  password?: UpdatePasswordPayload;
};
