/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionSchema } from './ActionSchema';

export type CommonSchema = {
    /**
     * Object type
     */
    object_type?: CommonSchema.object_type;
    /**
     * List of actions
     */
    actions?: Array<ActionSchema>;
};

export namespace CommonSchema {

    /**
     * Object type
     */
    export enum object_type {
        COMMENT = 'comment',
        ENTITY_USER = 'entity_user',
        ENTITY = 'entity',
        ENTITY_BANK_ACCOUNT = 'entity_bank_account',
        EXPORT = 'export',
        RECONCILIATION = 'reconciliation',
        ROLE = 'role',
        TODO_TASK = 'todo_task',
        TODO_TASK_MUTE = 'todo_task_mute',
        TRANSACTION = 'transaction',
        WORKFLOW = 'workflow',
    }


}

