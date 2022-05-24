/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingData } from './OnboardingData';
import type { OnboardingRequirement } from './OnboardingRequirement';

export type InternalOnboardingRequirementsResponse = {
  data?: OnboardingData;
  requirements: Array<OnboardingRequirement>;
};
