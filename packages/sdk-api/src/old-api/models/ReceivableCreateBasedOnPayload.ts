/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { BasedOnTransitionType } from './BasedOnTransitionType';

export type ReceivableCreateBasedOnPayload = {
  /**
   * The unique ID of a previous document related to the receivable if applicable.
   */
  based_on: string;
  /**
   * The type of a created receivable. Currently supported transitions:quote -> invoice; invoice -> credit_note
   */
  type: BasedOnTransitionType;
};
