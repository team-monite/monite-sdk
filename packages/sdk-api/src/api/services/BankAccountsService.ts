import { CancelablePromise } from '../CancelablePromise';
import { CreateEntityBankAccountRequest } from '../models/CreateEntityBankAccountRequest';
import { EntityBankAccountPaginationResponse } from '../models/EntityBankAccountPaginationResponse';
import { EntityBankAccountResponse } from '../models/EntityBankAccountResponse';
import { UpdateEntityBankAccountRequest } from '../models/UpdateEntityBankAccountRequest';
import { request } from '../request';
import { CommonService } from './CommonService';

export const BANK_ACCOUNTS_ENDPOINT = 'bank_accounts';

const errors = {
  400: `Bad Request`,
  401: `Unauthorized`,
  403: `Forbidden`,
  405: `Method Not Allowed`,
  422: `Validation Error`,
  500: `Internal Server Error`,
};

export class BankAccountsService extends CommonService {
  /**
   * Get all bank accounts of this entity.
   *
   * @see {@link https://docs.monite.com/reference/get_bank_accounts} for API call
   *
   * @returns EntityBankAccountPaginationResponse Successful Response
   * @throws ApiError
   */
  public getAll(): CancelablePromise<EntityBankAccountPaginationResponse> {
    return request(
      {
        method: 'GET',
        url: `/${BANK_ACCOUNTS_ENDPOINT}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Retrieve a bank account by its ID.
   *
   * @see {@link https://docs.monite.com/reference/get_bank_accounts_id} for API call
   *
   * @returns EntityBankAccountResponse Successful Response
   * @throws ApiError
   */
  public getById(
    bankAccountId: string
  ): CancelablePromise<EntityBankAccountResponse> {
    return request(
      {
        method: 'GET',
        url: `/${BANK_ACCOUNTS_ENDPOINT}/${bankAccountId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Create a new bank account for this entity.
   *
   * @see {@link https://docs.monite.com/reference/post_bank_accounts} for API call
   * @returns EntityBankAccountResponse Successful Response
   * @throws ApiError
   */
  public create(
    body: CreateEntityBankAccountRequest
  ): CancelablePromise<EntityBankAccountResponse> {
    return request(
      {
        method: 'POST',
        url: `/${BANK_ACCOUNTS_ENDPOINT}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Delete the bank account specified by its ID.
   *
   * @see {@link https://docs.monite.com/reference/delete_bank_accounts_id} for API call
   * @returns void Successful Response
   * @throws ApiError
   */
  public delete(bankAccountId: string): CancelablePromise<void> {
    return request(
      {
        method: 'DELETE',
        url: `/${BANK_ACCOUNTS_ENDPOINT}/${bankAccountId}`,
        errors,
      },
      this.openApi
    );
  }

  /**
   * Update the bank account specified by its ID.
   *
   * @see {@link https://docs.monite.com/reference/patch_bank_accounts_id} for API call
   * @returns EntityBankAccountResponse Successful Response
   * @throws ApiError
   */
  public update(
    bankAccountId: string,
    body: UpdateEntityBankAccountRequest
  ): CancelablePromise<EntityBankAccountResponse> {
    return request(
      {
        method: 'PATCH',
        url: `/${BANK_ACCOUNTS_ENDPOINT}/${bankAccountId}`,
        body,
        mediaType: 'application/json',
        errors,
      },
      this.openApi
    );
  }

  /**
   * Set a bank account as the default for this entity per currency.
   *
   * @see {@link https://docs.monite.com/reference/post_bank_accounts_id_make_default} for API call
   *
   * @returns EntityBankAccountResponse Successful Response
   * @throws ApiError
   */
  public makeDefault(
    bankAccountId: string
  ): CancelablePromise<EntityBankAccountResponse> {
    return request(
      {
        method: 'POST',
        url: `/${BANK_ACCOUNTS_ENDPOINT}/${bankAccountId}/make_default`,
        errors,
      },
      this.openApi
    );
  }
}
