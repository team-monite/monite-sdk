/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { MoniteAllPaymentMethods } from './MoniteAllPaymentMethods';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentMethodDirection } from './PaymentMethodDirection';
import type { PaymentMethodStatus } from './PaymentMethodStatus';

export type PaymentMethod = {
  direction: PaymentMethodDirection;
  name: MoniteAllPaymentMethods;
  status: PaymentMethodStatus;
  type: MoniteAllPaymentMethodsTypes;
};
