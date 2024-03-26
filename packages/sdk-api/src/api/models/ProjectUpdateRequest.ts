/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedCountriesNames } from './AllowedCountriesNames';
import type { EnvironmentEnum } from './EnvironmentEnum';
import type { ProjectsSettingsRequest } from './ProjectsSettingsRequest';

export type ProjectUpdateRequest = {
  description?: string;
  environment?: EnvironmentEnum;
  features?: Array<string>;
  name?: string;
  project_settings?: ProjectsSettingsRequest;
  region?: AllowedCountriesNames;
};
