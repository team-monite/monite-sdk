/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PersonRelationship = {
    /**
     * The person’s title (e.g., CEO, Support Engineer)
     */
    title?: string;
    /**
     * Whether the person is authorized as the primary representative of the account
     */
    representative?: boolean;
    /**
     * Whether the person has significant responsibility to control, manage, or direct the organization
     */
    executive?: boolean;
    /**
     * Whether the person is a director of the account’s legal entity
     */
    director?: boolean;
    /**
     * Whether the person is an owner of the account’s legal entity
     */
    owner?: boolean;
    /**
     * The percent owned by the person of the account’s legal entity
     */
    percent_ownership?: number;
};

