import { components } from '@/api';

export interface ExistingReceivableDetailsProps {
  /** Receivable ID */
  id: string;

  type?: never;

  /**
   * Indicates that the invoice has been deleted.
   *
   * Only draft invoices can be deleted. Deleted invoices
   *  can no longer be accessed.
   *
   * @param {string} invoiceId Invoice ID
   *
   * @returns {void}
   */
  onDelete?: (invoiceId: string) => void;

  /**
   * Indicates that the invoice has been finalized
   *  and issued to a counterpart. Issued invoices
   *  cannot be edited or deleted, just canceled.
   *
   * @param {string} invoiceId Invoice ID
   *
   * @returns {void}
   */
  onIssue?: (invoiceId: string) => void;

  /**
   * Indicates that the invoice has been canceled.
   *
   * The counterpart cannot view or make payments
   *  against a canceled invoice, although the entity
   *  can still view it.
   *
   * Only unpaid issued and overdue invoices can be canceled.
   *
   * @param {string} invoiceId Invoice ID
   *
   * @returns {void}
   */
  onCancel?: (invoiceId: string) => void;

  /**
   * Indicates that a counterpart is unlikely to pay this invoice.
   *
   * The difference between uncollectible and canceled is that
   *  uncollectible still has a legal claim on the counterpart.
   *
   * Uncollectible is also a final state after handing over an invoice
   *  to a debt collection agency that was not able to retrieve the funds.
   *
   * For bookkeeping, this is a right off and has a tax implication.
   *
   * @param {string} invoiceId Invoice ID
   *
   * @returns {void}
   */
  onMarkAsUncollectible?: (invoiceId: string) => void;
}

export interface InvoiceDetailsCreateProps {
  id?: never;

  /** The type of the receivable */
  type: components['schemas']['ReceivableResponse']['type'];

  /**
   * Indicates that the invoice has been successfuly created.
   *
   * @param {string} receivableId Invoice ID
   *
   * @returns {void}
   */
  onCreate?: (receivableId: string) => void;
}

export type InvoiceDetailsProps =
  | ExistingReceivableDetailsProps
  | InvoiceDetailsCreateProps;
