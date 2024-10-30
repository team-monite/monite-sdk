/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { SupportedFieldNames } from './SupportedFieldNames';

export type ExtraDataResource = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  field_name: SupportedFieldNames;
  field_value: string;
  object_id: string;
  object_type: ExtraDataResource.object_type;
};

export namespace ExtraDataResource {
  export enum object_type {
    COUNTERPART = 'counterpart',
  }
}
