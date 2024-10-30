/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CounterpartRawAddress } from './CounterpartRawAddress';
import type { CounterpartRawBankAccount } from './CounterpartRawBankAccount';
import type { CounterpartRawVatID } from './CounterpartRawVatID';

export type CounterpartRawData = {
  /**
   * The address of the vendor or supplier.
   */
  address?: CounterpartRawAddress;
  /**
   * Object representing counterpart bank account.
   */
  bank_account?: CounterpartRawBankAccount;
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
  vat_id?: CounterpartRawVatID;
};
