/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { UpdateProductForCreditNote } from './UpdateProductForCreditNote';

/**
 * Line item with given product id can be changed only once
 */
export type UpdateLineItemForCreditNote = Record<
  string,
  UpdateProductForCreditNote
>;
