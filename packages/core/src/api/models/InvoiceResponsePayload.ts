/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartAddress } from './CounterpartAddress';
import type { CounterpartType } from './CounterpartType';
import type { CurrencyEnum } from './CurrencyEnum';
import type { EntityAddressSchema } from './EntityAddressSchema';
import type { EntityBankAccountRequest } from './EntityBankAccountRequest';
import type { EntityIndividual } from './EntityIndividual';
import type { EntityOrganization } from './EntityOrganization';
import type { PaymentTerms } from './PaymentTerms';
import type { ReceivableCounterpartContact } from './ReceivableCounterpartContact';
import type { ReceivablesStatusEnum } from './ReceivablesStatusEnum';
import type { ResponseItem } from './ResponseItem';

/**
 * @TODO: Reshape this schema base
 * @see: https://gemms.atlassian.net/browse/DEV-2090
 */
export type InvoiceResponsePayload = {
    /**
     * The type of the document uploaded.
     */
    type: InvoiceResponsePayload.type;
    id: string;
    /**
     * Time at which the receivable was created. Timestamps follow the ISO 8601 standard.
     */
    created_at: string;
    /**
     * Time at which the receivable was last updated. Timestamps follow the ISO 8601 standard.
     */
    updated_at: string;
    /**
     * The sequential code systematically assigned to invoices.
     */
    document_id?: string;
    /**
     * The currency used in the receivable.
     */
    currency: CurrencyEnum;
    /**
     * The total price of the receivable.
     */
    total_amount: number;
    line_items: Array<ResponseItem>;
    entity_address: EntityAddressSchema;
    entity: (EntityOrganization | EntityIndividual);
    /**
     * Unique ID of the counterpart.
     */
    counterpart_id: string;
    /**
     * The type of the counterpart.
     */
    counterpart_type: CounterpartType;
    counterpart_address: CounterpartAddress;
    /**
     * Additional information about counterpart contacts.
     */
    counterpart_contact?: ReceivableCounterpartContact;
    /**
     * A legal name of a counterpart it is an organization
     */
    counterpart_name?: string;
    file_url?: string;
    /**
     * The commercial terms of the receivable (e.g. The products must be delivered in X days).
     */
    commercial_condition_description?: string;
    /**
     * The status of the receivable inside the receivable workflow.
     */
    status: ReceivablesStatusEnum;
    /**
     * The sum from the VAT of the individual line items monetary amount.
     */
    total_vat_amount: string;
    entity_bank_account?: EntityBankAccountRequest;
    /**
     * Indicates whether the goods, materials, or services listed in the receivable are exempt from VAT or not.
     */
    vat_exempt?: boolean;
    /**
     * The reason for the VAT exemption, if applicable.
     */
    vat_exemption_rationale?: string;
    /**
     * The unique ID of a previous document related to the receivable if applicable.
     */
    based_on?: string;
    payment_terms?: PaymentTerms;
};

export namespace InvoiceResponsePayload {

    /**
     * The type of the document uploaded.
     */
    export enum type {
        INVOICE = 'invoice',
    }


}
