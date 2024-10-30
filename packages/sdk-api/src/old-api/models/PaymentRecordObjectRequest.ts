/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ObjectTypeEnum } from './ObjectTypeEnum';

export type PaymentRecordObjectRequest = {
  /**
   * ID of the invoice
   */
  id: string;
  type: ObjectTypeEnum;
};
