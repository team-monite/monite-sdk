/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { SupportedFieldNames } from './SupportedFieldNames';

export type ExtraDataUpdateRequest = {
  field_name?: SupportedFieldNames;
  field_value?: string;
  object_id?: string;
  object_type?: ExtraDataUpdateRequest.object_type;
};

export namespace ExtraDataUpdateRequest {
  export enum object_type {
    COUNTERPART = 'counterpart',
  }
}
