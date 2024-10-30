/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ObjectTypeEnum } from './ObjectTypeEnum';

export type PaymentRecordObjectResponse = {
  /**
   * ID of the invoice
   */
  id: string;
  /**
   * Status, in which object has been moved
   */
  new_status: string;
  /**
   * Status, in which object was before payment
   */
  old_status: string;
  type: ObjectTypeEnum;
};
