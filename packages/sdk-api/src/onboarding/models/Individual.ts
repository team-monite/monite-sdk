/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Address } from './Address';

export type Individual = {
    first_name?: string;
    last_name?: string;
    address?: Address;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    id_number?: string;
    ssn_last_4?: string;
};

