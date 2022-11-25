/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 *
 * This Enum the results of combining two types of statuses from
 * ReceivablesQuoteStateEnum, ReceivablesCreditNoteStateEnum and InvoiceStateEnum. You shouldn't use
 * it in your scenarios if only for edge cases in workers, but ideally need to
 * remove this shared Enum.
 *
 *
 */
export enum ReceivablesReceivablesStatusEnum {
    DRAFT = 'draft',
    ISSUED = 'issued',
    ACCEPTED = 'accepted',
    EXPIRED = 'expired',
    DECLINED = 'declined',
    RECURRING = 'recurring',
    PARTIALLY_PAID = 'partially_paid',
    PAID = 'paid',
    OVERDUE = 'overdue',
    UNCOLLECTIBLE = 'uncollectible',
    CANCELED = 'canceled',
    DELETED = 'deleted',
}
