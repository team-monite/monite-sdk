/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { EInvoicingProviderEnum } from './EInvoicingProviderEnum';

export type EInvoicingSettingsResponse = {
  client_id: string;
  client_secret: string;
  provider: EInvoicingProviderEnum;
};
