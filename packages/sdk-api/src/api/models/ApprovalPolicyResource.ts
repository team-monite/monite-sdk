/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { ApprovalPolicyStatus } from './ApprovalPolicyStatus';

export type ApprovalPolicyResource = {
  /**
   * The name of the approval policy.
   */
  name: string;
  /**
   * A brief description of the approval policy.
   */
  description: string;
  /**
   * A list of JSON objects that represents the approval policy script. The script contains the logic that determines whether an action should be sent to approval. This field is required, and it should contain at least one script object.
   */
  script: Array<boolean | number | string | Record<string, any>>;
  /**
   * A JSON object that represents the trigger for the approval policy.The trigger specifies the event that will trigger the policy to be evaluated.
   */
  trigger?: boolean | number | string | Record<string, any>;
  id: string;
  /**
   * The current status of the approval policy.
   */
  status: ApprovalPolicyStatus;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
};
