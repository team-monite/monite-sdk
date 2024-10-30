/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { Unit } from './Unit';

export type ProjectsSettingsResponse = {
  currency?: CurrencyEnum;
  project_id: string;
  units?: Array<Unit>;
};
