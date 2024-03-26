/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountriesNames } from './AllowedCountriesNames';
import type { CompanyResponse } from './CompanyResponse';
import type { EnvironmentEnum } from './EnvironmentEnum';
import type { FeaturesResponse } from './FeaturesResponse';

export type ProjectResponse = {
  id: string;
  company: CompanyResponse;
  created_by_user_id: string;
  description?: string;
  environment?: EnvironmentEnum;
  features: Array<FeaturesResponse>;
  name: string;
  region?: AllowedCountriesNames;
};
