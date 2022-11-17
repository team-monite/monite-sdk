/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReceivablesCounterpartAddress } from './ReceivablesCounterpartAddress';
import type { ReceivablesCounterpartType } from './ReceivablesCounterpartType';
import type { ReceivablesCreditNoteStateEnum } from './ReceivablesCreditNoteStateEnum';
import type { ReceivablesCurrencyEnum } from './ReceivablesCurrencyEnum';
import type { ReceivablesDiscount } from './ReceivablesDiscount';
import type { ReceivablesEntityAddressSchema } from './ReceivablesEntityAddressSchema';
import type { ReceivablesEntityBankAccountRequest } from './ReceivablesEntityBankAccountRequest';
import type { ReceivablesEntityIndividual } from './ReceivablesEntityIndividual';
import type { ReceivablesEntityOrganization } from './ReceivablesEntityOrganization';
import type { ReceivablesReceivableCounterpartContact } from './ReceivablesReceivableCounterpartContact';
import type { ReceivablesResponseItem } from './ReceivablesResponseItem';

export type ReceivablesCreditNoteResponsePayload = {
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
    currency: ReceivablesCurrencyEnum;
    /**
     * The subtotal (excluding VAT), in [minor units](https://docs.monite.com/docs/currencies#minor-units).
     */
    total_amount: number;
    line_items: Array<ReceivablesResponseItem>;
    entity_address: ReceivablesEntityAddressSchema;
    entity: (ReceivablesEntityOrganization | ReceivablesEntityIndividual);
    /**
     * The entity user who created this document.
     */
    entity_user_id?: string;
    /**
     * Unique ID of the counterpart.
     */
    counterpart_id: string;
    /**
     * The type of the counterpart.
     */
    counterpart_type: ReceivablesCounterpartType;
    counterpart_address: ReceivablesCounterpartAddress;
    /**
     * Additional information about counterpart contacts.
     */
    counterpart_contact?: ReceivablesReceivableCounterpartContact;
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
     * The total VAT of all line items, in [minor units](https://docs.monite.com/docs/currencies#minor-units).
     */
    total_vat_amount: number;
    entity_bank_account?: ReceivablesEntityBankAccountRequest;
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
    /**
     * The unique document ID of a previous document related to the receivable if applicable.
     */
    based_on_document_id?: string;
    /**
     * A note with additional information for a receivable.
     */
    memo?: string;
    /**
     * Optional field for the issue of the entry.
     */
    issue_date?: string;
    /**
     * Address where goods were shipped / where services were provided.
     */
    counterpart_shipping_address?: ReceivablesCounterpartAddress;
    /**
     * Address of invoicing, need to state as a separate fields for some countries if it differs from address of a company.
     */
    counterpart_billing_address?: ReceivablesCounterpartAddress;
    /**
     * Different types of companies for different countries, ex. GmbH, SAS, SNC, etc.
     */
    counterpart_business_type?: string;
    /**
     * The discount for a receivable.
     */
    discount?: ReceivablesDiscount;
    /**
     * The type of the receivable
     */
    type: ReceivablesCreditNoteResponsePayload.type;
    /**
     * The status of the Credit Note inside the receivable workflow.
     */
    status: ReceivablesCreditNoteStateEnum;
    /**
     * Contain purchase order number.
     */
    purchase_order?: string;
};

export namespace ReceivablesCreditNoteResponsePayload {

    /**
     * The type of the receivable
     */
    export enum type {
        CREDIT_NOTE = 'credit_note',
    }


}

