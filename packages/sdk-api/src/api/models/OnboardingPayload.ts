/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Account } from './Account';

export type OnboardingPayload = {
    entity_id: string;
    /**
     * The URL the user will be redirected to if the account link is expired, has been previously-visited, or is otherwise invalid. The URL you specify should attempt to generate a new account link with the same parameters used to create the original account link, then redirect the user to the new account link’s URL so they can continue with Connect Onboarding. If a new account link cannot be generated or the redirect fails you should display a useful error to the user
     */
    refresh_url: string;
    /**
     * The URL that the user will be redirected to upon leaving or completing the linked flow
     */
    return_url: string;
    account: Account;
};

