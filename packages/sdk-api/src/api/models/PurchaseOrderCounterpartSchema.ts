/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { PurchaseOrderCounterpartIndividualRootResponse } from './PurchaseOrderCounterpartIndividualRootResponse';
import type { PurchaseOrderCounterpartOrganizationRootResponse } from './PurchaseOrderCounterpartOrganizationRootResponse';

/**
 * A Counterpart object contains information about an organization (juridical person) or
 * individual (natural person) that provides goods and services to or buys them from an
 * [SME](https://docs.monite.com/docs/glossary#sme).
 */
export type PurchaseOrderCounterpartSchema =
  | PurchaseOrderCounterpartIndividualRootResponse
  | PurchaseOrderCounterpartOrganizationRootResponse;
