/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { OnboardingLinksBusinessType } from './OnboardingLinksBusinessType';
import type { OnboardingLinksPerson } from './OnboardingLinksPerson';
import type { OnboardingLinksRequirement } from './OnboardingLinksRequirement';
import type { OnboardingLinksStripeData } from './OnboardingLinksStripeData';

export type OnboardingLinksStripeDataResponse = {
  business_type: OnboardingLinksBusinessType;
  requirements: Array<OnboardingLinksRequirement>;
  masks: Record<string, OnboardingLinksPerson>;
  data: OnboardingLinksStripeData;
};
