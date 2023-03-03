/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MultipleCountryPredicate } from './MultipleCountryPredicate';
import type { SingleCountryPredicate } from './SingleCountryPredicate';

export type CountryPredicate = (SingleCountryPredicate | MultipleCountryPredicate);

