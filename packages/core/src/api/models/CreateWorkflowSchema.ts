/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A Workflow object represents an approval policy for payable status transitions.
 * Workflows are defined using the [Monite script](https://docs.monite.com/docs/monite-script).
 * Each workflow consists of trigger conditions and the function calls executed when the workflow is triggered.
 */
export type CreateWorkflowSchema = {
    /**
     * The name of this workflow (approval policy).
     */
    policy_name: string;
    /**
     * An arbitrary description of this workflow (approval policy).
     */
    policy_description?: string;
    /**
     * The workflow definition in the [Monite script](https://docs.monite.com/docs/monite-script) format (as JSON).
     */
    workflow?: any;
};
