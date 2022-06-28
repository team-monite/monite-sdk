/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { api__schemas__payments__schemas__LineItem } from './api__schemas__payments__schemas__LineItem';
import type { Object } from './Object';

export type CheckoutSessionCreate = {
    partner_id: string;
    entity_user_id?: string;
    entity_id: string;
    success_url: string;
    cancel_url: string;
    line_items: Array<api__schemas__payments__schemas__LineItem>;
    object?: Object;
};
