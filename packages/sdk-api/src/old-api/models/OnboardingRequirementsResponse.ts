/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AccountDisabledReason } from './AccountDisabledReason';
import type { PaymentRequirements } from './PaymentRequirements';
import type { RequirementsError } from './RequirementsError';
import type { VerificationError } from './VerificationError';
import type { VerificationStatusEnum } from './VerificationStatusEnum';

export type OnboardingRequirementsResponse = {
  disabled_reason?: AccountDisabledReason;
  requirements: PaymentRequirements;
  requirements_errors: Array<RequirementsError>;
  verification_errors: Array<VerificationError>;
  verification_status: VerificationStatusEnum;
};
