/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MissingLineItemFields } from './MissingLineItemFields';

export type MissingFields = {
    /**
     * Missing fields of receivable.
     */
    receivable?: Array<string>;
    /**
     * Missing fields of entity.
     */
    entity?: Array<string>;
    /**
     * Missing fields of counterpart.
     */
    counterpart?: Array<string>;
    /**
     * Missing fields of line items.
     */
    products?: Array<MissingLineItemFields>;
};

