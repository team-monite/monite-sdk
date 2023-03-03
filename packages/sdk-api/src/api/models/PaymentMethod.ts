/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MoniteOnboardingPaymentMethods } from './MoniteOnboardingPaymentMethods';
import type { MoniteOnboardingPaymentMethodsTypes } from './MoniteOnboardingPaymentMethodsTypes';
import type { PaymentMethodStatus } from './PaymentMethodStatus';

export type PaymentMethod = {
    name: MoniteOnboardingPaymentMethods;
    type: MoniteOnboardingPaymentMethodsTypes;
    status: PaymentMethodStatus;
};

