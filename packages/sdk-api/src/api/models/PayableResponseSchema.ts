/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CounterpartAddress } from './CounterpartAddress';
import type { CurrencyEnum } from './CurrencyEnum';
import type { CurrencyExchangeSchema } from './CurrencyExchangeSchema';
import type { FileSchema } from './FileSchema';
import type { OcrRecognitionResponse } from './OcrRecognitionResponse';
import type { OCRResponseInvoiceReceiptData } from './OCRResponseInvoiceReceiptData';
import type { PayableLineItemsSchema } from './PayableLineItemsSchema';
import type { PayableOriginEnum } from './PayableOriginEnum';
import type { PayableStateEnum } from './PayableStateEnum';
import type { PaymentTermsCreatePayload } from './PaymentTermsCreatePayload';
import type { SourceOfPayableDataEnum } from './SourceOfPayableDataEnum';
import type { SuggestedPaymentTerm } from './SuggestedPaymentTerm';
import type { TagReadSchema } from './TagReadSchema';

/**
 * Represents an Accounts Payable document received from a vendor or supplier.
 */
export type PayableResponseSchema = {
    /**
     * A unique ID assigned to this payable.
     */
    id: string;
    /**
     * The ID of the entity to which the payable was issued.
     */
    entity_id: string;
    /**
     * An arbitrary comment that describes how and when this payable was paid.
     */
    marked_as_paid_with_comment?: string;
    /**
     * The ID of the entity user who marked this document as paid.
     */
    marked_as_paid_by_entity_user_id?: string;
    /**
     * The [status](https://docs.monite.com/docs/payables-lifecycle) of the payable.
     */
    status: PayableStateEnum;
    /**
     * Specifies how the property values of this payable were provided: `ocr` - Monite OCR service extracted the values from the provided PDF or image file, `user_specified` - values were added or updated via an API call.
     */
    source_of_payable_data: SourceOfPayableDataEnum;
    /**
     * The [currency code](https://docs.monite.com/docs/currencies) of the currency used in the payable.
     */
    currency?: CurrencyEnum;
    /**
     * The total amount to be paid, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
     */
    amount?: number;
    /**
     * An arbitrary description of this payable.
     */
    description?: string;
    /**
     * The date by which the payable must be paid, in the YYYY-MM-DD format. If the payable specifies payment terms with early payment discounts, this is the final payment date.
     */
    due_date?: string;
    /**
     * The number of days to pay with potential discount for options shorter than due_date
     */
    payment_terms?: PaymentTermsCreatePayload;
    /**
     * The suggested date and corresponding discount in which payable could be paid. The date is in the YYYY-MM-DD format. The discount is calculated as X * (10^-4) - for example, 100 is 1%, 25 is 0,25%, 10000 is 100 %. Date varies depending on the payment terms and may even be equal to the due date with discount 0.
     */
    suggested_payment_term?: SuggestedPaymentTerm;
    /**
     * The date when the payable was issued, in the YYYY-MM-DD format.
     */
    issued_at?: string;
    /**
     * SWIFT code (BIC) of the vendor's bank (if specified in the payable document).
     */
    counterpart_bank_id?: string;
    /**
     * The ID of the counterpart object that represents the vendor or supplier.
     */
    counterpart_id?: string;
    /**
     * Vendor's bank account number, IBAN, or similar (if specified in the payable document).
     */
    counterpart_account_id?: string;
    /**
     * Vendor or supplier name.
     */
    counterpart_name?: string;
    /**
     * The tax id of the counterpart.
     */
    counterpart_tax_id?: string;
    /**
     * The address of the vendor or supplier.
     */
    counterpart_address?: CounterpartAddress;
    /**
     * Specifies how this payable was created in Monite: `upload` - created via an API call, `email` - sent via email to the entity's mailbox.
     */
    payable_origin: PayableOriginEnum;
    was_created_by_user_id?: string;
    was_created_by_external_user_name?: string;
    was_created_by_external_user_id?: string;
    currency_exchange?: CurrencyExchangeSchema;
    /**
     * The original file from which this payable was created.
     */
    file?: FileSchema;
    /**
     * A list of user-defined tags (labels) assigned to this payable. Tags can be used to trigger a specific approval policy for this payable.
     */
    tags?: Array<TagReadSchema>;
    /**
     * UTC date and time when this payable was created. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
     */
    created_at: string;
    /**
     * UTC date and time when this payable was last updated. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
     */
    updated_at: string;
    /**
     * Data extracted from the uploaded payable by OCR.
     */
    other_extracted_data?: (OcrRecognitionResponse | OCRResponseInvoiceReceiptData);
    /**
     * The name of an existing workflow (approval policy) that applies to this payable, if any. A workflow is applied if the payable matches the workflow trigger conditions.
     */
    applied_policy?: string;
    /**
     * A unique invoice number assigned by the invoice issuer for payment tracking purposes. This is different from `id` which is an internal ID created automatically by Monite.
     */
    document_id?: string;
    /**
     * The subtotal amount to be paid, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
     */
    subtotal?: number;
    /**
     * Registered tax applied for a service price, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
     */
    tax?: number;
    /**
     * The email address from which the invoice was sent to the entity.
     */
    sender?: string;
    /**
     * The list of items present in the payable.
     */
    line_items?: Array<PayableLineItemsSchema>;
    /**
     * Id of OCR request to match asynchronous result of processing payable.
     */
    ocr_request_id?: string;
};

