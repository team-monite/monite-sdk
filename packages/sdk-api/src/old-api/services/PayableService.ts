import type { CancelablePromise } from '../CancelablePromise';
import { AttachFileToPayableRequest } from '../models/AttachFileToPayableRequest';
import { CreatePayableFromFileRequest } from '../models/CreatePayableFromFileRequest';
import type { CurrencyEnum } from '../models/CurrencyEnum';
import type { OrderEnum } from '../models/OrderEnum';
import { PayableCursorFields } from '../models/PayableCursorFields';
import { PayablePaginationResponse } from '../models/PayablePaginationResponse';
import { PayableResponseSchema } from '../models/PayableResponseSchema';
import type { PayableStateEnum } from '../models/PayableStateEnum';
import { PayableUpdateSchema } from '../models/PayableUpdateSchema';
import { PayableUploadWithDataSchema } from '../models/PayableUploadWithDataSchema';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const PAYABLES_ENDPOINT = 'payables';

export class PayablesService extends CommonService {
  /**
   * Get Payables
   * Lists all payables from the connected entity.
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param createdAt
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @param status
   * @param amount
   * @param amountGt
   * @param amountLt
   * @param amountGte
   * @param amountLte
   * @param currency
   * @param counterpartName
   * @param dueDate
   * @param dueDateGt
   * @param dueDateLt
   * @param dueDateGte
   * @param dueDateLte
   * @returns PaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: PayableCursorFields,
    createdAt?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string,
    status?: PayableStateEnum,
    amount?: number,
    amountGt?: number,
    amountLt?: number,
    amountGte?: number,
    amountLte?: number,
    currency?: CurrencyEnum,
    counterpartName?: string,
    dueDate?: string,
    dueDateGt?: string,
    dueDateLt?: string,
    dueDateGte?: string,
    dueDateLte?: string
  ): CancelablePromise<PayablePaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${PAYABLES_ENDPOINT}`,
        query: {
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          created_at: createdAt,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
          status: status,
          amount: amount,
          amount__gt: amountGt,
          amount__lt: amountLt,
          amount__gte: amountGte,
          amount__lte: amountLte,
          currency: currency,
          counterpart_name: counterpartName,
          due_date: dueDate,
          due_date__gt: dueDateGt,
          due_date__lt: dueDateLt,
          due_date__gte: dueDateGte,
          due_date__lte: dueDateLte,
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
   * Get Payable by ID
   * Payable from the connected entity.
   * @param id
   * @returns PayableResponseSchema Successful Response
   * @throws ApiError
   */
  public getById(id: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'GET',
        url: `/${PAYABLES_ENDPOINT}/${id}`,
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
   * Create Payable By Id
   * Add a new payable by providing the amount, currency, vendor name, and other details.
   * You can provide the base64_encoded contents of the original invoice file in the field `base64_encoded_file`.
   *
   * You can use this endpoint to bypass the Monite OCR service and provide the data directly
   * (for example, if you already have the data in place).
   *
   * A newly created payable has the `draft` status.
   * @param body
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public create(
    body: PayableUploadWithDataSchema
  ): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}`,
        body,
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
   * Update Payable By Id
   * @param id
   * @param body
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public update(
    id: string,
    body: PayableUpdateSchema
  ): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'PATCH',
        url: `/${PAYABLES_ENDPOINT}/${id}`,
        body,
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
   * Submit Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public submit(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/submit_for_approval`,
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
   * Approve Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public approve(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/approve_payment_operation`,
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
   * Reject Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public reject(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/reject`,
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

  public cancel(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/cancel`,
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
   * Pay Payable By Id
   * @param payableId
   * @returns PayableResponse Successful Response
   * @throws ApiError
   */
  public pay(payableId: string): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/pay`,
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
   * Upload Payable From File
   * Upload an incoming invoice (payable) in PDF, PNG, JPEG, or TIFF format and scan its contents. The maximum file size is 10MB.
   * @param formData
   * @returns PayableResponseSchema Successful Response
   * @throws ApiError
   */
  public uploadFromFile(
    formData: CreatePayableFromFileRequest
  ): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/upload_from_file`,
        formData: formData,
        mediaType: 'multipart/form-data',
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Attach a file to a payable
   * Attach file to payable without existing attachment.
   * @param payableId
   * @param formData
   * @returns PayableResponseSchema Successful Response
   * @throws ApiError
   */
  public attachFile(
    payableId: string,
    formData: AttachFileToPayableRequest
  ): CancelablePromise<PayableResponseSchema> {
    return __request(
      {
        method: 'POST',
        url: `/${PAYABLES_ENDPOINT}/${payableId}/attach_file`,
        path: {
          payable_id: payableId,
        },
        formData: formData,
        mediaType: 'multipart/form-data',
        errors: {
          400: `Bad Request`,
          403: `Forbidden`,
          404: `Not Found`,
          405: `Method Not Allowed`,
          409: `Possible responses: \`Action for {object_type} at permissions not found: {action}\`, \`Object type at permissions not found: {object_type}\`, \`Action {action} for {object_type} not allowed\`, \`Payable couldn't be updated due to current state\`, \`The file cannot be attached because another file is already attached. Please note that only one file attachment is allowed.\``,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
