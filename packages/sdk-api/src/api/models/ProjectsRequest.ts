/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountriesNames } from './AllowedCountriesNames';
import type { EnvironmentEnum } from './EnvironmentEnum';

export type ProjectsRequest = {
  description?: string;
  environment?: EnvironmentEnum;
  name: string;
  region?: AllowedCountriesNames;
};
