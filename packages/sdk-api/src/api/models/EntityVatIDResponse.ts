/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountries } from './AllowedCountries';
import type { VatIDTypeEnum } from './VatIDTypeEnum';

export type EntityVatIDResponse = {
  id: string;
  country: AllowedCountries;
  entity_id: string;
  type?: VatIDTypeEnum;
  value: string;
};
