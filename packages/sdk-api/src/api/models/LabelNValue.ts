/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Item } from './Item';

/**
 * A label-value pair extracted from an uploaded document by OCR.
 * For example, the label could be "Total" and the value could be a currency amount.
 */
export type LabelNValue = {
    /**
     * Text label.
     */
    label: Item;
    /**
     * The value (if any).
     */
    value: Item;
};

