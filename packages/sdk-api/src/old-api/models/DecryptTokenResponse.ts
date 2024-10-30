/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { TokenSerializerTypeEnum } from './TokenSerializerTypeEnum';

export type DecryptTokenResponse = {
  company_name: string;
  email: string;
  expired: boolean;
  token_type: TokenSerializerTypeEnum;
};
