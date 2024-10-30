/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingRequirementsError } from './OnboardingRequirementsError';
import type { OnboardingVerificationError } from './OnboardingVerificationError';
import type { OnboardingVerificationStatusEnum } from './OnboardingVerificationStatusEnum';
import type { PaymentMethodRequirements } from './PaymentMethodRequirements';

export type SingleOnboardingRequirementsResponse = {
  disabled_reason?: string;
  payment_method: string;
  requirements: PaymentMethodRequirements;
  requirements_errors: Array<OnboardingRequirementsError>;
  verification_errors: Array<OnboardingVerificationError>;
  verification_status: OnboardingVerificationStatusEnum;
};
