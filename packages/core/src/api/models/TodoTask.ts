/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TodoTask = {
    id: string;
    oid: number;
    entity_user_id: string;
    status: string;
    viewed: boolean;
    object_id?: string;
    object_type: string;
    action: string;
    performed_by_user_id?: string;
};
