/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';

export type EnabledPaymentMethods = {
  /**
   * Deprecated. Use payment_methods_receive instead.
   * @deprecated
   */
  payment_methods?: Array<MoniteAllPaymentMethodsTypes>;
  /**
   * Enable payment methods to receive money.
   */
  payment_methods_receive?: Array<MoniteAllPaymentMethodsTypes>;
  /**
   * Enable payment methods to send money.
   */
  payment_methods_send?: Array<MoniteAllPaymentMethodsTypes>;
};
