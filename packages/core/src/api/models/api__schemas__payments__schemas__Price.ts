/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CurrencyEnum } from './CurrencyEnum';
import type { Product } from './Product';

export type api__schemas__payments__schemas__Price = {
    unit_amount: number;
    currency: CurrencyEnum;
    product: Product;
};
