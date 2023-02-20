/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';

export type Company = {
    name?: string;
    tax_id?: string;
    address?: Address;
    phone?: string;
    email?: string;
    directors_provided?: boolean;
    owners_provided?: boolean;
    executives_provided?: boolean;
};

