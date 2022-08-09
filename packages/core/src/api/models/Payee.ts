/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountIdentification } from './AccountIdentification';
import type { Address } from './Address';

export type Payee = {
    name: string;
    account_identifications: Array<AccountIdentification>;
    address: Address;
};

