/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Recipient } from './Recipient';

export type OnboardingLinkResponse = {
    id: string;
    created_at: string;
    expires_at: string;
    url: string;
    recipient: Recipient;
    refresh_url: string;
    return_url: string;
};

