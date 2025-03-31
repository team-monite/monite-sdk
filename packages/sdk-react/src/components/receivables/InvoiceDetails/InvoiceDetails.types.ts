import { components } from '@/api';
import { CustomerTypes } from '@/components/counterparts/types';
import { GenericCounterpartContact } from '@/core/queries';

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
   * Indicates that the invoice has been updated.
   *
   * @param {string} invoiceId Invoice ID
   * @param {components['schemas']['InvoiceResponsePayload']} invoice Updated invoice object
   *
   * @returns {void}
   */
  onUpdate?: (
    invoiceId: string,
    invoice?: components['schemas']['InvoiceResponsePayload']
  ) => void;

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

  /**
   * Indicates that an invoice email has been sent to the counterpart.
   *
   * @param {string} invoiceId - Invoice ID
   * @param {boolean} isFirstInvoice - Whether this is the first invoice sent by the entity
   *
   * @returns {void}
   */
  onSendEmail?: (invoiceId: string, isFirstInvoice: boolean) => void;
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
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
}

export type InvoiceDetailsProps = {
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
} & (ExistingReceivableDetailsProps | InvoiceDetailsCreateProps);

export type CounterpartOrganizationRootResponse =
  components['schemas']['CounterpartOrganizationRootResponse'];

export type Contact = GenericCounterpartContact;
