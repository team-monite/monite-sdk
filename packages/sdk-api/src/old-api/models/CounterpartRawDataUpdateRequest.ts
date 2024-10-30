/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartRawAddressUpdateRequest } from './CounterpartRawAddressUpdateRequest';
import type { CounterpartRawBankAccountUpdateRequest } from './CounterpartRawBankAccountUpdateRequest';
import type { CounterpartRawVatIDUpdateRequest } from './CounterpartRawVatIDUpdateRequest';

export type CounterpartRawDataUpdateRequest = {
  /**
   * The address of the vendor or supplier.
   */
  address?: CounterpartRawAddressUpdateRequest;
  /**
   * Object representing counterpart bank account.
   */
  bank_account?: CounterpartRawBankAccountUpdateRequest;
  /**
   * The email address of the organization
   */
  email?: string;
  /**
   * Vendor or supplier name.
   */
  name?: string;
  /**
   * The phone number of the organization
   */
  phone?: string;
  /**
   * The tax id of the counterpart.
   */
  tax_id?: string;
  /**
   * VAT ID of the vendor or supplier which was used in the invoice.
   */
  vat_id?: CounterpartRawVatIDUpdateRequest;
};
