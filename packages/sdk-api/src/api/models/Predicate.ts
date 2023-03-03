/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AmountPredicate } from './AmountPredicate';
import type { CountryPredicate } from './CountryPredicate';
import type { ItemTypePredicate } from './ItemTypePredicate';
import type { VatPredicate } from './VatPredicate';

export type Predicate = (AmountPredicate | CountryPredicate | ItemTypePredicate | VatPredicate);

