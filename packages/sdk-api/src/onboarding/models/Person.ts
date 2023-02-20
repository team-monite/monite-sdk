/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';
import type { Relationship } from './Relationship';

export type Person = {
    first_name?: string;
    last_name?: string;
    address?: Address;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    ssn_last_4?: string;
    relationship?: Relationship;
};

