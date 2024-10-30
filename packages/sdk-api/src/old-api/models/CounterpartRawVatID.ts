/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';

export type CounterpartRawVatID = {
  country?: AllowedCountries;
  type?: string;
  value?: string;
};
