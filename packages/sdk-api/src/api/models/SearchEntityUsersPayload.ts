/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SearchEntityUsersPayload = {
    id__in?: Array<string>;
    id__not_in?: Array<string>;
    entity_id?: string;
    role__permissions__contains?: string;
    role_id?: string;
    login?: string;
    status?: string;
};

