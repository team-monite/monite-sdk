/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { TaxIDTypeEnum } from './TaxIDTypeEnum';

export type CounterpartVatID = {
  country?: AllowedCountries;
  type?: TaxIDTypeEnum;
  value: string;
};
