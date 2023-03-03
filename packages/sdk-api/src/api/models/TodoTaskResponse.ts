/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TodoTaskResponse = {
    id: string;
    oid: number;
    entity_user_id: string;
    status: string;
    viewed: boolean;
    object_id?: string;
    object_type: string;
    action: string;
    performed_by_user_id?: string;
    /**
     * Todo task is created on behalf of some specific object (e.g. payable) and references to its ID. This field contains information about the related object (e.g. payload PayableResponseSchema).
     */
    related_object?: any;
};

