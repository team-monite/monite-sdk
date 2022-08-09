/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItem } from './LineItem';

export type CheckoutSessionCreate = {
    partner_id?: string;
    entity_user_id?: string;
    entity_id?: string;
    success_url: string;
    cancel_url: string;
    line_items: Array<LineItem>;
};

