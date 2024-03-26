/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';

export type CounterpartRawVatIDUpdateRequest = {
  country?: AllowedCountries;
  type?: string;
  value?: string;
};
