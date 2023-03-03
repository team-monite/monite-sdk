/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';

export type ExchangeRate = {
    base: CurrencyEnum;
    to: CurrencyEnum;
    rate: number;
};

