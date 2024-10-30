/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { FileSchema } from './FileSchema';
import type { StatusEnum } from './StatusEnum';

export type CompanyResponse = {
  id: string;
  contact_email?: string;
  contact_phone?: string;
  created_by_user_id?: string;
  logo?: FileSchema;
  name: string;
  status: StatusEnum;
  website: string;
};
