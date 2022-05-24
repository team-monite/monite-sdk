import {
  CounterpartAddressResourceList,
  CounterpartAddressResponseWithCounterpartID,
  CounterpartAddress,
  CounterpartUpdateAddress,
} from '../../api';
import type { CancelablePromise } from '../CancelablePromise';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export const ADDRESSES_ENDPOINT = 'addresses';

export class CounterpartsAddressesService extends CommonService {
  /**
   * Get Counterpart Addresses
   * @param counterpartId
   * @returns CounterpartAddressResourceList Successful Response
   * @throws ApiError
   */
  public getCounterpartAddresses(
    counterpartId: string
  ): CancelablePromise<CounterpartAddressResourceList> {
    return __request(
      {
        method: 'GET',
        url: `/counterparts/{counterpart_id}/${ADDRESSES_ENDPOINT}`,
        path: {
          counterpart_id: counterpartId,
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
   * Create Counterparts Address
   * @param counterpartId
   * @param requestBody
   * @returns CounterpartAddressResponseWithCounterpartID Successful Response
   * @throws ApiError
   */
  public createCounterpartAddress(
    counterpartId: string,
    requestBody: CounterpartAddress
  ): CancelablePromise<CounterpartAddressResponseWithCounterpartID> {
    return __request(
      {
        method: 'POST',
        url: `/counterparts/{counterpart_id}/${ADDRESSES_ENDPOINT}`,
        path: {
          counterpart_id: counterpartId,
        },
        body: requestBody,
        mediaType: 'application/json',
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
   * Get Counterpart Addresses By Id
   * @param addressId
   * @param counterpartId
   * @returns CounterpartAddressResponseWithCounterpartID Successful Response
   * @throws ApiError
   */
  public getCounterpartAddressesById(
    addressId: string,
    counterpartId: string
  ): CancelablePromise<CounterpartAddressResponseWithCounterpartID> {
    return __request(
      {
        method: 'GET',
        url: `/counterparts/{counterpart_id}/${ADDRESSES_ENDPOINT}/{address_id}`,
        path: {
          address_id: addressId,
          counterpart_id: counterpartId,
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
   * Delete Counterpart Address By Id
   * @param addressId
   * @param counterpartId
   * @returns void
   * @throws ApiError
   */
  public deleteCounterpartAddressById(
    addressId: string,
    counterpartId: string
  ): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: `/counterparts/{counterpart_id}/${ADDRESSES_ENDPOINT}/{address_id}`,
        path: {
          address_id: addressId,
          counterpart_id: counterpartId,
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
   * Update Counterparts Address
   * @param addressId
   * @param counterpartId
   * @param requestBody
   * @returns CounterpartAddressResponseWithCounterpartID Successful Response
   * @throws ApiError
   */
  public updateCounterpartsAddress(
    addressId: string,
    counterpartId: string,
    requestBody: CounterpartUpdateAddress
  ): CancelablePromise<CounterpartAddressResponseWithCounterpartID> {
    return __request(
      {
        method: 'PATCH',
        url: `/counterparts/{counterpart_id}/${ADDRESSES_ENDPOINT}/{address_id}`,
        path: {
          address_id: addressId,
          counterpart_id: counterpartId,
        },
        body: requestBody,
        mediaType: 'application/json',
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
   * Make Counterparts Address Default
   * @param addressId
   * @param counterpartId
   * @returns CounterpartAddressResponseWithCounterpartID Successful Response
   * @throws ApiError
   */
  public makeCounterpartsAddressDefault(
    addressId: string,
    counterpartId: string
  ): CancelablePromise<CounterpartAddressResponseWithCounterpartID> {
    return __request(
      {
        method: 'POST',
        url: `/counterparts/{counterpart_id}/${ADDRESSES_ENDPOINT}/{address_id}/make_default`,
        path: {
          address_id: addressId,
          counterpart_id: counterpartId,
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
}
