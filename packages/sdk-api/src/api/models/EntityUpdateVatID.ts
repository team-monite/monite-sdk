/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { VatIDTypeEnum } from './VatIDTypeEnum';

export type EntityUpdateVatID = {
  country?: AllowedCountries;
  type?: VatIDTypeEnum;
  value?: string;
};
