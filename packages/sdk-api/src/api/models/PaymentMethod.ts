/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MoniteAllPaymentMethods } from './MoniteAllPaymentMethods';
import type { MoniteAllPaymentMethodsTypes } from './MoniteAllPaymentMethodsTypes';
import type { PaymentMethodStatus } from './PaymentMethodStatus';

export type PaymentMethod = {
    name: MoniteAllPaymentMethods;
    type: MoniteAllPaymentMethodsTypes;
    status: PaymentMethodStatus;
};

