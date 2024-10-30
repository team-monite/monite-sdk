/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CurrencyEnum } from './CurrencyEnum';
import type { Unit } from './Unit';

export type ProjectsSettingsRequest = {
  currency: CurrencyEnum;
  units?: Array<Unit>;
};
