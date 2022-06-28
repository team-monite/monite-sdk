/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActionEnum } from './ActionEnum';

/**
 * A Workflow object represents an approval policy for payable status transitions.
 * Workflows are defined using the [Monite script](https://docs.monite.com/docs/monite-script).
 * Each workflow consists of trigger conditions and the function calls executed when the workflow is triggered.
 */
export type WorkflowResponseSchema = {
    /**
     * A unique ID of this workflow.
     */
    id: string;
    /**
     * The ID of the entity user that created this workflow.
     */
    created_by_entity_user_id: string;
    /**
     * The type of objects associated with this workflow.
     */
    object_type: string;
    /**
     * The name of this workflow.
     */
    policy_name: string;
    /**
     * An arbitrary description of this workflow.
     */
    policy_description?: string;
    /**
     * A list of functions executed when the workflow is triggered. Functions are defined in the [Monite script](https://docs.monite.com/docs/monite-script) format.
     */
    workflow: Array<any>;
    /**
     * The trigger conditions for this workflow. Triggers are defined in the [Monite script](https://docs.monite.com/docs/monite-script) format.
     */
    trigger: any;
    /**
     * The workflow is triggered only when this action is performed on an object. This is the same value as `trigger.action`.
     */
    action: ActionEnum;
    /**
     * UTC date and time when this workflow was created. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
     */
    created_at: string;
    /**
     * UTC date and time when this workflow was last updated. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
     */
    updated_at: string;
};
