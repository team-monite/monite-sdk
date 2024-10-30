/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { VatIDTypeEnum } from './VatIDTypeEnum';

export type EntityVatID = {
  country: AllowedCountries;
  type?: VatIDTypeEnum;
  value: string;
};
