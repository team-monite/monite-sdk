/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { ExchangeRate } from './ExchangeRate';

export type CurrencySettings = {
    default_currency: CurrencyEnum;
    exchange_rates?: Array<ExchangeRate>;
};
