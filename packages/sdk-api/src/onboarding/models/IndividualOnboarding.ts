/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BusinessType } from './BusinessType';
import type { Data } from './Data';
import type { Requirement } from './Requirement';

export type IndividualOnboarding = {
    business_type: BusinessType;
    requirements: Array<Requirement>;
    data: Data;
};

