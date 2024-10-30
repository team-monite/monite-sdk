import type { CancelablePromise } from '../CancelablePromise';
import type { LineItemCursorFields } from '../models/LineItemCursorFields';
import type { LineItemPaginationResponse } from '../models/LineItemPaginationResponse';
import type { LineItemRequest } from '../models/LineItemRequest';
import type { LineItemResponse } from '../models/LineItemResponse';
import type { OrderEnum } from '../models/OrderEnum';
import { request as __request } from '../request';
import { CommonService } from './CommonService';
import { PAYABLES_ENDPOINT } from './PayableService';

export const LINE_ITEMS_ENDPOINT = 'line_items';

/**
 * PayableLineItemsService is responsible for managing line items related to payables.
 *
 * @see {@link https://docs.monite.com/docs/manage-line-items} for an API documentation
 */
export class PayableLineItemsService extends CommonService {
  /**
   * Get Line Items
   * Get a list of all line items related to the specified payable.
   * @param payableId  Specific payable ID to get line items for
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param wasCreatedByUserId
   *
   * @see {@link https://docs.monite.com/reference/get_payables_id_line_items} for API call
   * @see {@link https://docs.monite.com/docs/manage-line-items#list-all-line-items-of-a-payable} for additional documentation
   *
   * @returns LineItemPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    payableId: string,
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: LineItemCursorFields,
    wasCreatedByUserId?: string
  ): CancelablePromise<LineItemPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/${LINE_ITEMS_ENDPOINT}`,
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          was_created_by_user_id: wasCreatedByUserId,
        },
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Create Line Item
   * Create a new line item for a specified payable.
   * @param payableId
   * @param requestBody
   *
   * @see {@link https://docs.monite.com/reference/post_payables_id_line_items} for API call
   * @see {@link https://docs.monite.com/docs/manage-line-items#add-line-items-to-a-payable} for additional documentation
   *
   * @returns LineItemResponse Successful Response
   * @throws ApiError
   */
  public create(
    payableId: string,
    requestBody: LineItemRequest
  ): CancelablePromise<LineItemResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/${LINE_ITEMS_ENDPOINT}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Get Line Item
   * Get information about a line item with the given ID.
   * @param payableId
   * @param lineItemId
   *
   * @see {@link https://docs.monite.com/reference/get_payables_id_line_items_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-line-items#retrieve-a-line-item} for additional documentation
   *
   * @returns LineItemResponse Successful Response
   * @throws ApiError
   */
  public getById(
    payableId: string,
    lineItemId: string
  ): CancelablePromise<LineItemResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/${LINE_ITEMS_ENDPOINT}/${lineItemId}`,
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Delete Line Item
   * Delete the line item with the given ID.
   * @param payableId
   * @param lineItemId
   * @see {@link https://docs.monite.com/reference/delete_payables_id_line_items_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-line-items#remove-a-line-item} for additional documentation
   *
   * @returns void
   * @throws ApiError
   */
  public delete(
    payableId: string,
    lineItemId: string
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/${LINE_ITEMS_ENDPOINT}/${lineItemId}`,
        errors: {
          400: `Bad Request`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Update Line Item
   * Change the line item data.
   * @param payableId
   * @param lineItemId
   *
   * @see {@link https://docs.monite.com/reference/patch_payables_id_line_items_id} for API call
   * @see {@link https://docs.monite.com/docs/manage-line-items#update-a-line-item} for additional documentation
   *
   * @param requestBody
   * @returns LineItemResponse Successful Response
   * @throws ApiError
   */
  public update(
    payableId: string,
    lineItemId: string,
    requestBody: LineItemRequest
  ): CancelablePromise<LineItemResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/${LINE_ITEMS_ENDPOINT}/${lineItemId}`,
        body: requestBody,
        mediaType: 'application/json',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not found`,
          405: `Method Not Allowed`,
          406: `Not Acceptable`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
