/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { Media } from './Media';

export type Bank = {
  bank_id: string;
  country: AllowedCountries;
  media: Array<Media>;
  name: string;
  payer_required: boolean;
};
