/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountDisabledReason } from './AccountDisabledReason';
import type { PaymentRequirements } from './PaymentRequirements';
import type { ProvidedDataResponse } from './ProvidedDataResponse';
import type { RequirementsError } from './RequirementsError';
import type { VerificationError } from './VerificationError';
import type { VerificationStatusEnum } from './VerificationStatusEnum';

export type OnboardingRequirementsResponse = {
    verification_status: VerificationStatusEnum;
    disabled_reason?: AccountDisabledReason;
    requirements_errors: Array<RequirementsError>;
    verification_errors: Array<VerificationError>;
    provided_data: ProvidedDataResponse;
    requirements: PaymentRequirements;
};

