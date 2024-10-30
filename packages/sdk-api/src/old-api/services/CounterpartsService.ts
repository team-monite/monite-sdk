/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CancelablePromise } from '../CancelablePromise';
import { CounterpartBankAccountResourceList } from '../models/CounterpartBankAccountResourceList';
import { CounterpartBankAccountResponse } from '../models/CounterpartBankAccountResponse';
import type { CounterpartContactResponse } from '../models/CounterpartContactResponse';
import type { CounterpartContactsResourceList } from '../models/CounterpartContactsResourceList';
import type { CounterpartCreatePayload } from '../models/CounterpartCreatePayload';
import type { CounterpartCursorFields } from '../models/CounterpartCursorFields';
import type { CounterpartPaginationResponse } from '../models/CounterpartPaginationResponse';
import type { CounterpartResponse } from '../models/CounterpartResponse';
import type { CounterpartType } from '../models/CounterpartType';
import { CounterpartUpdatePayload } from '../models/CounterpartUpdatePayload';
import { CounterpartVatID } from '../models/CounterpartVatID';
import { CounterpartVatIDResourceList } from '../models/CounterpartVatIDResourceList';
import { CounterpartVatIDResponse } from '../models/CounterpartVatIDResponse';
import { CreateCounterpartBankAccount } from '../models/CreateCounterpartBankAccount';
import { CreateCounterpartContactPayload } from '../models/CreateCounterpartContactPayload';
import type { OrderEnum } from '../models/OrderEnum';
import { UpdateCounterpartBankAccount } from '../models/UpdateCounterpartBankAccount';
import { UpdateCounterpartContactPayload } from '../models/UpdateCounterpartContactPayload';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const COUNTERPARTS_ENDPOINT = 'counterparts';
export const COUNTERPARTS_CONTACT_ENDPOINT = 'contacts';
export const COUNTERPARTS_BANK_ENDPOINT = 'bank_accounts';
export const COUNTERPARTS_VAT_ENDPOINT = 'vat_ids';

const errors = {
  400: `Bad Request`,
  401: `Unauthorized`,
  403: `Forbidden`,
  405: `Method Not Allowed`,
  422: `Validation Error`,
  500: `Internal Server Error`,
};

export type CounterpartData<T> = {
  data: T;
};

export class CounterpartsService extends CommonService {
  /**
   * Get Counterparts
   * @param iban The IBAN of the entity’s bank account.
   * @param order Order by
   * @param limit Max is 100
   * @param paginationToken A token, obtained from previous page. Prior over other filters
   * @param sort Allowed sort fields
   * @param type
   * @param counterpartName
   * @param counterpartNameContains
   * @param counterpartNameIcontains
   * @param isVendor
   * @param isCustomer
   * @param email
   * @param emailContains
   * @param emailIcontains
   * @param createdAt
   * @param createdAtGt
   * @param createdAtLt
   * @param createdAtGte
   * @param createdAtLte
   * @returns ReceivablesCounterpartReceivablesPaginationResponse Successful Response
   * @throws ApiError
   */
  public getList(
    iban?: string,
    order?: OrderEnum,
    limit: number = 100,
    paginationToken?: string,
    sort?: CounterpartCursorFields,
    type?: CounterpartType,
    counterpartName?: string,
    counterpartNameContains?: string,
    counterpartNameIcontains?: string,
    isVendor?: boolean,
    isCustomer?: boolean,
    email?: string,
    emailContains?: string,
    emailIcontains?: string,
    createdAt?: string,
    createdAtGt?: string,
    createdAtLt?: string,
    createdAtGte?: string,
    createdAtLte?: string
  ): CancelablePromise<CounterpartPaginationResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}`,
        query: {
          iban: iban,
          order: order,
          limit: limit,
          pagination_token: paginationToken,
          sort: sort,
          type: type,
          counterpart_name: counterpartName,
          counterpart_name__contains: counterpartNameContains,
          counterpart_name__icontains: counterpartNameIcontains,
          is_vendor: isVendor,
          is_customer: isCustomer,
          email: email,
          email__contains: emailContains,
          email__icontains: emailIcontains,
          created_at: createdAt,
          created_at__gt: createdAtGt,
          created_at__lt: createdAtLt,
          created_at__gte: createdAtGte,
          created_at__lte: createdAtLte,
        },
        errors: {
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
   * Create a counterpart
   * This endpoint creates a new counterpart.
   * @param body
   * @returns CounterpartResponse Successful Response
   * @throws ApiError
   */
  public create(
    body: CounterpartCreatePayload
  ): CancelablePromise<CounterpartResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${COUNTERPARTS_ENDPOINT}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart by ID
   * @param counterpartId
   * @returns CounterpartResponse Successful Response
   * @throws ApiError
   */
  public getById(
    counterpartId: string
  ): CancelablePromise<CounterpartResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Update a counterpart
   * This endpoint creates a new counterpart.
   * @param counterpartId
   * @param body
   * @returns CounterpartResponse Successful Response
   * @throws ApiError
   */
  public update(
    counterpartId: string,
    body: CounterpartUpdatePayload
  ): CancelablePromise<CounterpartResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Delete Counterpart by ID
   * @param counterpartId
   * @returns void Successful Response
   * @throws ApiError
   */
  public delete(counterpartId: string): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart Contacts
   * @param counterpartId
   * @returns CounterpartContactsResourceList Successful Response
   * @throws ApiError
   */
  public getContacts(
    counterpartId: string
  ): CancelablePromise<CounterpartContactsResourceList> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_CONTACT_ENDPOINT}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Create a counterpart contact
   * This endpoint creates a new counterpart contact.
   * @param counterpartId
   * @param body
   * @returns CounterpartContactResponse Successful Response
   * @throws ApiError
   */
  public createContact(
    counterpartId: string,
    body: CreateCounterpartContactPayload
  ): CancelablePromise<CounterpartContactResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_CONTACT_ENDPOINT}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart Contact
   * @param counterpartId
   * @param contactId
   * @returns CounterpartContactResponse Successful Response
   * @throws ApiError
   */
  public getContactById(
    counterpartId: string,
    contactId: string
  ): CancelablePromise<CounterpartContactResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_CONTACT_ENDPOINT}/${contactId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Update Counterpart Contact
   * @param counterpartId
   * @param contactId
   * @param body
   * @returns CounterpartContactResponse Successful Response
   * @throws ApiError
   */
  public updateContact(
    counterpartId: string,
    contactId: string,
    body: UpdateCounterpartContactPayload
  ): CancelablePromise<CounterpartContactResponse> {
    return __request(
      {
        method: 'PATCH',
        body,
        mediaType: 'application/json',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_CONTACT_ENDPOINT}/${contactId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Delete Counterpart Contact
   * @param counterpartId
   * @param contactId
   * @returns void Successful Response
   * @throws ApiError
   */
  public deleteContact(
    counterpartId: string,
    contactId: string
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_CONTACT_ENDPOINT}/${contactId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Set default Counterpart Contact
   * @param counterpartId
   * @param contactId
   * @returns CounterpartContactResponse Successful Response
   * @throws ApiError
   */
  public makeContactDefault(
    counterpartId: string,
    contactId: string
  ): CancelablePromise<CounterpartContactResponse> {
    return __request(
      {
        method: 'PATCH',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_CONTACT_ENDPOINT}/${contactId}/make_default`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart Bank Accounts
   * @param counterpartId
   * @returns CounterpartBankAccountResponse Successful Response
   * @throws ApiError
   */
  public getBankAccounts(
    counterpartId: string
  ): CancelablePromise<CounterpartBankAccountResourceList> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_BANK_ENDPOINT}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Create a counterpart Bank Account
   * This endpoint creates a new counterpart Bank Account.
   * @param counterpartId
   * @param body
   * @returns CounterpartBankAccountResponse Successful Response
   * @throws ApiError
   */
  public createBankAccount(
    counterpartId: string,
    body: CreateCounterpartBankAccount
  ): CancelablePromise<CounterpartBankAccountResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_BANK_ENDPOINT}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart Bank Account
   * @param counterpartId
   * @param bankAccountId
   * @returns CounterpartBankAccountResponse Successful Response
   * @throws ApiError
   */
  public getBankAccountById(
    counterpartId: string,
    bankAccountId: string
  ): CancelablePromise<CounterpartBankAccountResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_BANK_ENDPOINT}/${bankAccountId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Update Counterpart Bank Account
   * @param counterpartId
   * @param bankAccountId
   * @param body
   * @returns CounterpartBankAccountResponse Successful Response
   * @throws ApiError
   */
  public updateBankAccount(
    counterpartId: string,
    bankAccountId: string,
    body: UpdateCounterpartBankAccount
  ): CancelablePromise<CounterpartBankAccountResponse> {
    return __request(
      {
        method: 'PATCH',
        body,
        mediaType: 'application/json',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_BANK_ENDPOINT}/${bankAccountId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Delete Counterpart Bank Account
   * @param counterpartId
   * @param bankAccountId
   * @returns void Successful Response
   * @throws ApiError
   */
  public deleteBankAccount(
    counterpartId: string,
    bankAccountId: string
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_BANK_ENDPOINT}/${bankAccountId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart Vat IDs
   * @param counterpartId
   * @returns CounterpartVatIDResponse Successful Response
   * @throws ApiError
   */
  public getVats(
    counterpartId: string
  ): CancelablePromise<CounterpartVatIDResourceList> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_VAT_ENDPOINT}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Create Counterpart Vat ID
   * This endpoint creates a new counterpart Vat ID.
   * @param counterpartId
   * @param body
   * @returns CounterpartVatIDResponse Successful Response
   * @throws ApiError
   */
  public createVat(
    counterpartId: string,
    body: CounterpartVatID
  ): CancelablePromise<CounterpartVatIDResponse> {
    return __request(
      {
        method: 'POST',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_VAT_ENDPOINT}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Get Counterpart Vat ID
   * @param counterpartId
   * @param vatId
   * @returns CounterpartVatIDResponse Successful Response
   * @throws ApiError
   */
  public getVatById(
    counterpartId: string,
    vatId: string
  ): CancelablePromise<CounterpartVatIDResponse> {
    return __request(
      {
        method: 'GET',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_VAT_ENDPOINT}/${vatId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Update Counterpart Vat ID
   * @param counterpartId
   * @param vatId
   * @param body
   * @returns CounterpartVatIDResponse Successful Response
   * @throws ApiError
   */
  public updateVat(
    counterpartId: string,
    vatId: string,
    body: CounterpartVatID
  ): CancelablePromise<CounterpartVatIDResponse> {
    return __request(
      {
        method: 'PATCH',
        body,
        mediaType: 'application/json',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_VAT_ENDPOINT}/${vatId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Delete Counterpart Vat ID
   * @param counterpartId
   * @param vatId
   * @returns void Successful Response
   * @throws ApiError
   */
  public deleteVat(
    counterpartId: string,
    vatId: string
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/${COUNTERPARTS_ENDPOINT}/${counterpartId}/${COUNTERPARTS_VAT_ENDPOINT}/${vatId}`,
        errors,
      },
      this.openApi
    );
  }
}
