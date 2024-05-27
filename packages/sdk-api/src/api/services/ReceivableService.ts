import {
  MissingFields,
  OrderEnum,
  ReceivableCursorFields,
  ReceivableDeclinePayload,
  ReceivablePaginationResponse,
  ReceivablePaidPayload,
  ReceivablePartiallyPaidPayload,
  ReceivablesStatusEnum,
  ReceivableType,
  ReceivableResponse,
  ReceivableFacadeCreatePayload,
  ReceivableUpdatePayload,
  SuccessResult,
  ReceivableSendRequest,
  ReceivableSendResponse,
  ReceivablePreviewRequest,
  ReceivablePreviewResponse,
  ReceivableFileUrl,
  LineItemsResponse,
  UpdateLineItems,
} from '../../api';
import type { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const RECEIVABLES_ENDPOINT = 'receivables';

/**
 * `ReceivableService` is responsible for transport level
 *  managing all account receivables
 *
 * Accounts receivable refers to the money owed to a company
 *  by its clients for products or services that
 *  have been delivered, but not paid for yet.
 *
 * Some of the document types used in accounts receivable are:
 * - Invoice - a request for payment that lists the products or services
 *    that were delivered, and the amount due.
 * - Quote - a formal offer that details how much the products or services
 *    will cost, before the client commits to a purchase.
 * - Credit note - reduces the amount due on an invoice.
 *
 *
 * With Monite API, partners can automate the accounts receivable processes
 *  for SMEs so that they can:
 * - Generate branded invoices, quotes, and credit notes.
 * - Send the documents via email, or generate a PDF.
 * - Have payment reminders sent automatically to the SME's customers.
 * - Track the document status (for example, issued, paid, or expired).
 *
 * @see {@link https://docs.monite.com/docs/ar-overview} of an API documentation
 */
export class ReceivableService extends CommonService {
  /**
   * Get all receivables
   *
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param type
   * @param documentId
   * @param documentIdContains
   * @param documentIdIcontains
   * @param issueDateGt
   * @param issueDateLt
   * @param issueDateGte
   * @param issueDateLte
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @param counterpartName
   * @param counterpartId
   * @param counterpartNameIcontains
   * @param amount
   * @param amountGt
   * @param amountLt
   * @param amountGte
   * @param amountLte
   * @param status
   * @param statusIn
   * @param entityUserId
   * @param entityUserIdIn
   * @param basedOn
   * @param dueDateLte
   *
   * @see {@link https://docs.monite.com/reference/get_receivables} for API calls
   * @see {@link https://docs.monite.com/docs/manage-products#list-all-products} for additional documentation
   *
   * @returns ReceivablePaginationResponse Successful Response
   * @throws ApiError
   */
  public getAllReceivables(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: ReceivableCursorFields,
    type?: ReceivableType,
    documentId?: string,
    documentIdContains?: string,
    documentIdIcontains?: string,
    issueDateGt?: string,
    issueDateLt?: string,
    issueDateGte?: string,
    issueDateLte?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string,
    counterpartName?: string,
    counterpartId?: string,
    counterpartNameIcontains?: string,
    amount?: number,
    amountGt?: number,
    amountLt?: number,
    amountGte?: number,
    amountLte?: number,
    status?: ReceivablesStatusEnum,
    statusIn?: Array<ReceivablesStatusEnum>,
    entityUserId?: string,
    entityUserIdIn?: Array<string>,
    basedOn?: string,
    dueDateLte?: string
  ): CancelablePromise<ReceivablePaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${RECEIVABLES_ENDPOINT}`,
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          type: type,
          document_id: documentId,
          document_id__contains: documentIdContains,
          document_id__icontains: documentIdIcontains,
          issue_date__gt: issueDateGt,
          issue_date__lt: issueDateLt,
          issue_date__gte: issueDateGte,
          issue_date__lte: issueDateLte,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
          counterpart_name: counterpartName,
          counterpart_id: counterpartId,
          counterpart_name__icontains: counterpartNameIcontains,
          amount: amount,
          amount__gt: amountGt,
          amount__lt: amountLt,
          amount__gte: amountGte,
          amount__lte: amountLte,
          status: status,
          status__in: statusIn,
          entity_user_id: entityUserId,
          entity_user_id__in: entityUserIdIn,
          based_on: basedOn,
          due_date__lte: dueDateLte,
        },
        errors: {
          400: `Bad Request`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          409: `Possible responses: \`Action for {object_type} at permissions not found: {action}\`,\`Object type at permissions not found: {object_type}\`,\`Action {action} for {object_type} not allowed\``,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Create New Receivable
   *
   * All new invoices are created as drafts (with status `draft`).
   * A draft invoice is not issued yet and can be edited anytime.
   * A draft invoice can remain stored in the platform
   *  as a draft or move to deleted or issued.
   *
   * @param {ReceivableFacadeCreatePayload} requestBody Different payloads for different types of receivables
   *
   * @see {@link https://docs.monite.com/reference/post_receivables} for API calls
   * @see {@link https://docs.monite.com/docs/manage-products#create-a-product} for additional documentation
   *
   * @returns {ReceivableResponse} successful response
   * @throws ApiError
   */
  public createNewReceivable(
    requestBody: ReceivableFacadeCreatePayload
  ): CancelablePromise<ReceivableResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Biz logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Get Receivable By Id
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/get_receivables_id} for API calls
   *
   * @returns {ReceivableResponse} successful response
   * @throws ApiError
   */
  public getById(receivableId: string): CancelablePromise<ReceivableResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Delete receivable by id
   * Only draft invoices can be deleted. Deleted invoices
   *  can no longer be accessed.
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/delete_receivables_id} for API call
   * @see {@link https://docs.monite.com/docs/receivables-lifecycle#deleted} for lifecycle details
   *
   * @returns Nothing with `204` status code
   * @throws ApiError
   */
  public deleteById(receivableId: string): CancelablePromise<void> {
    return __request<void>(
      {
        method: 'DELETE',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}`,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not found',
          405: 'Method Not Allowed',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Update the line items of a receivable by receivable id
   *
   * @param {string} receivableId Receivable identifier
   * @param {UpdateLineItems} lineItems Line items to update
   *
   * @see {@link https://docs.monite.com/reference/put_receivables_id_line_items} for API call
   *
   * @returns {LineItemsResponse} Successful Response
   * @throws ApiError
   */
  public updateLineItemsById(
    receivableId: string,
    lineItems: UpdateLineItems
  ): CancelablePromise<LineItemsResponse> {
    return __request<LineItemsResponse>(
      {
        method: 'PUT',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/line_items`,
        body: lineItems,
        mediaType: 'application/json',
      },
      this.openApi
    );
  }

  /**
   * Update Receivable by id
   * All newly created invoices start in the draft status.
   * You can edit draft invoices before issuing them to a counterpart.
   *
   * @param {string} receivableId Receivable identifier
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/patch_receivables_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-invoices#update-an-invoice} for additional documentation
   *
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public updateById(
    receivableId: string,
    requestBody: Omit<ReceivableUpdatePayload, 'lineItems'>
  ): CancelablePromise<ReceivableResponse> {
    return __request<ReceivableResponse>(
      {
        method: 'PATCH',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Business logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Accept Quote
   * Indicates that the counterpart has accepted the quote.
   * Only issued quotes can be accepted.
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_accept} for API call
   * @see {@link https://docs.monite.com/docs/quote-lifecycle#accepted} for additional documentation
   *
   * @returns SuccessResult Successful Response
   * @throws ApiError
   */
  public acceptById(receivableId: string): CancelablePromise<SuccessResult> {
    return __request<SuccessResult>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/accept`,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Business logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Cancel receivable by id.
   *
   * Indicates that the invoice has been canceled.
   * The counterpart cannot view or make payments against a canceled invoice,
   *  although the entity can still view it.
   * Only unpaid issued and overdue invoices can be canceled.
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_cancel} for API call
   * @see {@link https://docs.monite.com/docs/receivables-lifecycle#canceled} for lifecycle details
   *
   * @returns Nothing with `204` status code
   * @throws ApiError
   */
  public cancelById(receivableId: string): CancelablePromise<void> {
    return __request<void>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/cancel`,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not found',
          405: 'Method Not Allowed',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Clone Receivable
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_clone} for API call
   *
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public cloneById(
    receivableId: string
  ): CancelablePromise<ReceivableResponse> {
    return __request<ReceivableResponse>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/clone`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Business logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Decline Quote
   * Issued quotes can be declined.
   * This is a final state, i.e., declined quotes cannot be accepted or deleted, but can still be viewed.
   *
   * @param {string} receivableId Receivable identifier
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_decline} for API call
   * @see {@link https://docs.monite.com/docs/quote-lifecycle#declined} for additional documentation
   *
   * @returns SuccessResult Successful Response
   * @throws ApiError
   */
  public declineById(
    receivableId: string,
    requestBody?: ReceivableDeclinePayload
  ): CancelablePromise<SuccessResult> {
    return __request<SuccessResult>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/decline`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Business logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Issue receivable by id
   *
   * Indicates that the invoice has been finalized and issued
   *  to a counterpart. Issued invoices cannot be edited or deleted,
   *  just canceled.
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_issue} for API call
   * @see {@link https://docs.monite.com/docs/receivables-lifecycle#issued} for lifecycle details
   *
   * @returns `ReceivableResponse` successful response
   */
  public issueById(
    receivableId: string
  ): CancelablePromise<ReceivableResponse> {
    return __request<ReceivableResponse>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/issue`,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not found',
          405: 'Method Not Allowed',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Mark As Paid
   * Indicates that the invoice has been paid.
   * Optionally, you can provide a JSON request body with the comment field
   * that provides additional information about the paid invoice.
   *
   * @param {string} receivableId Receivable identifier
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_mark_as_paid} for API call
   * @see {@link https://docs.monite.com/docs/manage-invoices#mark-an-invoice-as-paid} for lifecycle details
   *
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public markAsPaidById(
    receivableId: string,
    requestBody?: ReceivablePaidPayload
  ): CancelablePromise<ReceivableResponse> {
    return __request<ReceivableResponse>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/mark_as_paid`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Business logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Mark As Partially Paid
   *
   * @param {string} receivableId Receivable identifier
   * @param requestBody
   *
   * @returns ReceivableResponse Successful Response
   * @throws ApiError
   */
  public markAsPartiallyPaidById(
    receivableId: string,
    requestBody?: ReceivablePartiallyPaidPayload
  ): CancelablePromise<ReceivableResponse> {
    return __request<ReceivableResponse>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/mark_as_partially_paid`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          409: `Business logic error`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Indicates that a counterpart is unlikely to pay this invoice.
   *
   * The difference between `uncollectible` and `canceled` is that
   *  uncollectible still has a legal claim on the counterpart.
   * Uncollectible is also a final state after handing over an invoice
   *  to a debt collection agency that was not able to retrieve the funds.
   * For bookkeeping, this is a right off and has a tax implication.
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_mark_as_uncollectible} for API call
   * @see {@link https://docs.monite.com/docs/receivables-lifecycle#uncollectible} for lifecycle details
   *
   * @returns Nothing with `204` status code
   * @throws ApiError
   */
  public markAsUncollectibleById(
    receivableId: string
  ): CancelablePromise<ReceivableResponse> {
    return __request<ReceivableResponse>(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/mark_as_uncollectible`,
        errors: {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not found',
          405: 'Method Not Allowed',
          409: 'Business logic error',
          422: 'Validation Error',
          500: 'Internal Server Error',
        },
      },
      this.openApi
    );
  }

  /**
   * Get a link to the PDF version of a receivable
   *
   * @see {@link https://docs.monite.com/reference/get_receivables_id_pdf_link} for API call
   *
   * @returns `ReceivableFileUrl` Successful Response
   * @throws ApiError
   */
  public getPdfLink(
    receivableId: string
  ): CancelablePromise<ReceivableFileUrl> {
    return __request(
      {
        method: 'GET',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/pdf_link`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Verify Receivable
   *
   * @param {string} receivableId Receivable identifier
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_verify} for API call
   *
   * @returns MissingFields Successful Response
   * @throws ApiError
   */
  public verifyById(receivableId: string): CancelablePromise<MissingFields> {
    return __request(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/verify`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Send a receivable via email
   *
   * @param {string} receivableId Receivable identifier
   * @param body
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_send} for API call
   *
   * @returns ReceivableSendResponse Successful Response
   * @throws ApiError
   */
  public send(
    receivableId: string,
    body: ReceivableSendRequest
  ): CancelablePromise<ReceivableSendResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/send`,
        body: body,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Preview a receivable's email message
   *
   * @param {string} receivableId Receivable identifier
   * @param body
   *
   * @see {@link https://docs.monite.com/reference/post_receivables_id_preview} for API call
   *
   * @returns ReceivablePreviewResponse Successful Response
   * @throws ApiError
   */
  public preview(
    receivableId: string,
    body: ReceivablePreviewRequest
  ): CancelablePromise<ReceivablePreviewResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${RECEIVABLES_ENDPOINT}/${receivableId}/preview`,
        body: body,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
