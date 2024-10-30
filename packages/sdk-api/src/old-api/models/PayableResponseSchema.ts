/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartRawData } from './CounterpartRawData';
import type { CurrencyEnum } from './CurrencyEnum';
import type { CurrencyExchangeSchema } from './CurrencyExchangeSchema';
import type { monite__schemas__file_saver__FileSchema } from './monite__schemas__file_saver__FileSchema';
import type { OcrRecognitionResponse } from './OcrRecognitionResponse';
import type { OCRResponseInvoiceReceiptData } from './OCRResponseInvoiceReceiptData';
import type { OcrStatusEnum } from './OcrStatusEnum';
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
   * UTC date and time when this payable was created. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
   */
  created_at: string;
  /**
   * UTC date and time when this payable was last updated. Timestamps follow the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
   */
  updated_at: string;
  /**
   * How much is left to be paid on the invoice (in minor units).
   */
  amount_due?: number;
  /**
   * How much was paid on the invoice (in minor units).
   */
  amount_paid?: number;
  /**
   * How much is left to be paid on the invoice (in minor units) with discounts from payment terms.
   */
  amount_to_pay?: number;
  /**
   * Id of existing approval policy that applies to this payable, if any. A policy is applied if the payable matches the policy trigger conditions.
   */
  approval_policy_id?: string;
  /**
   * Object representing de-normalized counterpart data. Filled at the moment of invoice submitting for approval or payment.
   */
  counterpart?: CounterpartRawData;
  /**
   * The ID of counterpart address object stored in counterparts service
   */
  counterpart_address_id?: string;
  /**
   * The ID of counterpart bank account object stored in counterparts service
   */
  counterpart_bank_account_id?: string;
  /**
   * The ID of the counterpart object that represents the vendor or supplier.
   */
  counterpart_id?: string;
  /**
   * Object representing counterpart data which was extracted by OCR. Used for informational purposes.
   */
  counterpart_raw_data?: CounterpartRawData;
  /**
   * The ID of counterpart VAT ID object stored in counterparts service
   */
  counterpart_vat_id_id?: string;
  /**
   * The [currency code](https://docs.monite.com/docs/currencies) of the currency used in the payable.
   */
  currency?: CurrencyEnum;
  currency_exchange?: CurrencyExchangeSchema;
  /**
   * An arbitrary description of this payable.
   */
  description?: string;
  /**
   * A unique invoice number assigned by the invoice issuer for payment tracking purposes. This is different from `id` which is an internal ID created automatically by Monite.
   */
  document_id?: string;
  /**
   * The date by which the payable must be paid, in the YYYY-MM-DD format. If the payable specifies payment terms with early payment discounts, this is the final payment date.
   */
  due_date?: string;
  /**
   * The ID of the entity to which the payable was issued.
   */
  entity_id: string;
  /**
   * The original file from which this payable was created.
   */
  file?: monite__schemas__file_saver__FileSchema;
  /**
   * The date when the payable was issued, in the YYYY-MM-DD format.
   */
  issued_at?: string;
  /**
   * The ID of the entity user who marked this document as paid.
   */
  marked_as_paid_by_entity_user_id?: string;
  /**
   * An arbitrary comment that describes how and when this payable was paid.
   */
  marked_as_paid_with_comment?: string;
  /**
   * Id of OCR request to match asynchronous result of processing payable.
   */
  ocr_request_id?: string;
  /**
   * The status of the data recognition process using OCR. The 'processing' status means that the data recognition is in progress and the user needs to wait for the data enrichment. The 'error' status indicates that some error occurred on the OCR side and the user can fill in the data manually. The 'success' status means the data recognition has been successfully completed, after which the user can check the data if desired and enrich or correct it.
   */
  ocr_status?: OcrStatusEnum;
  /**
   * Data extracted from the uploaded payable by OCR.
   */
  other_extracted_data?: OcrRecognitionResponse | OCRResponseInvoiceReceiptData;
  /**
   * Metadata for partner needs
   */
  partner_metadata?: Record<string, any>;
  /**
   * Specifies how this payable was created in Monite: `upload` - created via an API call, `email` - sent via email to the entity's mailbox.
   */
  payable_origin: PayableOriginEnum;
  /**
   * The number of days to pay with potential discount for options shorter than due_date
   */
  payment_terms?: PaymentTermsCreatePayload;
  /**
   * The email address from which the invoice was sent to the entity.
   */
  sender?: string;
  /**
   * Specifies how the property values of this payable were provided: `ocr` - Monite OCR service extracted the values from the provided PDF or image file, `user_specified` - values were added or updated via an API call.
   */
  source_of_payable_data: SourceOfPayableDataEnum;
  /**
   * The [status](https://docs.monite.com/docs/payables-lifecycle) of the payable.
   */
  status: PayableStateEnum;
  /**
   * The subtotal amount to be paid, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
   */
  subtotal?: number;
  /**
   * The suggested date and corresponding discount in which payable could be paid. The date is in the YYYY-MM-DD format. The discount is calculated as X * (10^-4) - for example, 100 is 1%, 25 is 0,25%, 10000 is 100 %. Date varies depending on the payment terms and may even be equal to the due date with discount 0.
   */
  suggested_payment_term?: SuggestedPaymentTerm;
  /**
   * A list of user-defined tags (labels) assigned to this payable. Tags can be used to trigger a specific approval policy for this payable.
   */
  tags?: Array<TagReadSchema>;
  /**
   * Registered tax percentage applied for a service price in minor units, e.g. 200 means 2%, 1050 means 10.5%.
   */
  tax?: number;
  /**
   * Tax amount in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
   */
  tax_amount?: number;
  /**
   * The total amount to be paid, in [minor units](https://docs.monite.com/docs/currencies#minor-units). For example, $12.50 is represented as 1250.
   */
  total_amount?: number;
  was_created_by_user_id?: string;
};
