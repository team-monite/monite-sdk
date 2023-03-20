/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A scheme for validation an entity user additional info
 */
export type package__auth_n_settings__v2023_02_07__schemas__entity_users__UpdateEntityUserRequest = {
    /**
     * An entity user business email
     */
    email?: string;
    /**
     * An entity user phone number in the international format
     */
    phone?: string;
    /**
     * UUID of the role assigned to this entity user
     */
    role_id?: string;
    /**
     * First name
     */
    first_name?: string;
    /**
     * Last name
     */
    last_name?: string;
    /**
     * Title
     */
    title?: string;
    /**
     * Login
     */
    login?: string;
};

