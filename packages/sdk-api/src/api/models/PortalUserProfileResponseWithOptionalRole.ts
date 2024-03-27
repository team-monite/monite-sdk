/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CompanyResponse } from './CompanyResponse';
import type { FileSchema } from './FileSchema';
import type { PortalUserStatus } from './PortalUserStatus';

export type PortalUserProfileResponseWithOptionalRole = {
  id: string;
  avatar?: FileSchema;
  company: CompanyResponse;
  email: string;
  fullname: string;
  role_id?: string;
  status: PortalUserStatus;
};
