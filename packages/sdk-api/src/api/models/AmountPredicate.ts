/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MultipleAmountPredicate } from './MultipleAmountPredicate';
import type { SingleAmountPredicate } from './SingleAmountPredicate';

export type AmountPredicate = (SingleAmountPredicate | MultipleAmountPredicate);

