/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { SupportedFieldNames } from './SupportedFieldNames';

export type ExtraDataCreateRequest = {
  field_name: SupportedFieldNames;
  field_value: string;
  object_id: string;
  object_type: ExtraDataCreateRequest.object_type;
};

export namespace ExtraDataCreateRequest {
  export enum object_type {
    COUNTERPART = 'counterpart',
  }
}
