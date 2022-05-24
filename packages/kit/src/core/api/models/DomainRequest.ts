/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmailServiceProviderEnum } from './EmailServiceProviderEnum';

export type DomainRequest = {
    domain: string;
    /**
     * Email service provider
     */
    provider?: EmailServiceProviderEnum;
};
